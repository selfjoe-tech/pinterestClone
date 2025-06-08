import { NextResponse } from "next/server";
import { client } from "@/sanity/client";

// slugifies a tag title into a safe _id
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export const config = { api: { bodyParser: false } };

export async function POST(req) {
  try {
    const form = await req.formData();
    const title = form.get("title")?.trim();
    const link = form.get("link")?.trim() || "";
    const mediaType = form.get("mediaType");
    const file = form.get("file");
    const userId = form.get("userId");

    if (!title || !mediaType || !file || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert categories
    const rawTags = form.getAll("tags[]");
    const categoryRefs = [];
    for (const tag of rawTags) {
      const slug = slugify(tag);
      const cat = await client.createIfNotExists({
        _id: `category-${slug}`,
        _type: "category",
        title: tag
      });
      categoryRefs.push({ _type: "reference", _ref: cat._id });
    }

    // Upload media asset
    const buffer      = Buffer.from(await file.arrayBuffer());
    const uploadType = mediaType === "image" ? "image" : "file";

    const asset = await client.assets.upload(
    uploadType,            
    buffer,
    { filename: file.name }
    );

    // Build and create Pin document
    const newPin = {
      _type: "pin",
      title,
      link,
      mediaType,
      likes: 0,
      postedBy: { _type: "reference", _ref: userId },
      createdAt: new Date().toISOString(),
      categories: categoryRefs,
      ...(mediaType === "image"
        ? { image: { _type: "image", asset: { _type: "reference", _ref: asset._id } } }
        : { video: { _type: "file",  asset: { _type: "reference", _ref: asset._id } } }
      )
    };

    const created = await client.create(newPin);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Error in createPin:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}