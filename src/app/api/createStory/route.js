import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

// We must disable Next.js’s built-in JSON parser, since we need `FormData`
export const config = {
  api: { bodyParser: false },
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function POST(request) {
  try {
    // 1) Parse the incoming multipart/form-data
    const data = await request.formData();

    // 2) Required: userId
    const userId = data.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // 3) Required: title (we will set it as both story.caption and pin.title)
    const title = data.get('title')?.trim();
    if (!title) {
      return NextResponse.json({ error: 'Missing title' }, { status: 400 });
    }

    // 4) Read zero‐or‐more tags[]
    const rawTags = data.getAll('tags[]').map((t) => t.trim()).filter(Boolean);

    // 5) Read mediaFiles[] and mediaTypes[]
    const rawFiles = data.getAll('mediaFiles[]');   // array of File objects
    const rawTypes = data.getAll('mediaTypes[]');   // ["image", "video", …]
    if (rawFiles.length === 0 || rawTypes.length !== rawFiles.length) {
      return NextResponse.json(
        { error: 'Missing or mismatched mediaFiles[] / mediaTypes[]' },
        { status: 400 }
      );
    }

    // 6) Upsert each tag string into a Category document
    const categoryRefs = [];
    for (const tag of rawTags) {
      const slug = slugify(tag);
      const catDoc = await client.createIfNotExists({
        _id: `category-${slug}`,
        _type: 'category',
        title: tag,
      });
      categoryRefs.push({ _type: 'reference', _ref: catDoc._id });
    }

    // 7) Upload each File to Sanity assets, build a `mediaEntries` array with unique _key
    const mediaEntries = [];
    for (let i = 0; i < rawFiles.length; i++) {
      const file = rawFiles[i];
      const mediaType = rawTypes[i]; // either "image" or "video"

      // a) Convert File → Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // b) Upload as either 'image' or 'file' asset
      const uploadAssetType = mediaType === 'image' ? 'image' : 'file';
      const assetDoc = await client.assets.upload(
        uploadAssetType,
        buffer,
        { filename: file.name }
      );

      // c) Generate a random _key for this object
      const _key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      // d) Push the correct shape into mediaEntries
      if (mediaType === 'image') {
        mediaEntries.push({
          _key,
          _type: 'object',
          mediaType: 'image',
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetDoc._id },
          },
        });
      } else {
        mediaEntries.push({
          _key,
          _type: 'object',
          mediaType: 'video',
          video: {
            _type: 'file',
            asset: { _type: 'reference', _ref: assetDoc._id },
          },
        });
      }
    }

    // 8) Build and create the Story document
    const storyDoc = {
      _type: 'story',
      postedBy: { _type: 'reference', _ref: userId },
      postedAt: new Date().toISOString(),
      caption: title,
      media: mediaEntries,
    };
    // If there were any categories, we could store them on the story as well,
    // but per your schema, story.tsx does not have a categories field. So we skip it.

    const createdStory = await client.create(storyDoc);

    // 9) Now build the Pin document that references the new story
    //    Pin schema requires:
    //      title (string, required),
    //      postedBy (reference → user),
    //      createdAt,
    //      categories (array of references → category),
    //      stories (array of references → story),
    //    We leave mediaType / image / video / description / link / comments untouched.

    const new_key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const pinDoc = {
      _type: 'pin',
      title: title,
      postedBy: { _type: 'reference', _ref: userId },
      createdAt: new Date().toISOString(),
      categories: categoryRefs.length > 0 ? categoryRefs : [],
      stories: [
        {  
          _key: new_key,
          _type: 'reference',
          _ref: createdStory._id,
        },
      ],
      // `likes` will default to 0 (because the schema says `initialValue: 0`)
      // We do not set `mediaType`, `image`, or `video` on this pin, since
      // we are using the "stories" array instead. You may omit them entirely.
    };

    const createdPin = await client.create(pinDoc);

    // 10) Return the newly created Pin (which now holds a reference to its Story)
    return NextResponse.json(createdPin, { status: 201 });
  } catch (err) {
    console.error('🔥 Error in /api/createStory:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}