import { client } from '@/sanity/client';


export async function POST(request) {
  
  try {
    const { input } = await request.json();

    if (!input) {
      return new Response(JSON.stringify({ error: 'Missing searchTerm' }), { status: 400 });
    }


    const searchTerm = input
      .trim()
      .split(/\s+/)    
      .filter(Boolean);

    const blob = searchTerm.join(" ");
    const clause = searchTerm.map((_,i) => 
      `
      ( 
        title match $t${i} || 
        postedBy->userName match $t${i} || 
        categories[]->title match $t${i}
      )
      `
      ).join(" || ");

      const searchQuery = `*[
  _type == "pin" &&
  (
    (
    title match $search || 
    postedBy->userName match $search || 
    categories[]->title match $search
    ) 
    ||
    (${clause})
  )
]{
  _id,
  title,
  description,
  mediaType,
  image {
    asset-> {
      url
    }
  },
  video {
    asset-> {
      url
    }
  },
  postedBy-> {
    _id,
    userName,
    profileImage {
      asset-> {
        url
      }
    }
  },
  createdAt,
  categories[]-> {
    _id,
    title
  },
  stories[]-> {
    _id,
    mediaType,
    media[] {
      mediaType,
      image {
        asset-> {
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      },
      video {
        asset-> {
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      }
    }
  }
}`;

    const params = {
      search: `*${blob}*`,
      ...searchTerm.reduce((accumulator, term, index) => {
      accumulator[`t${index}`] = `*${term}*`;
      return accumulator;
      }, {}),
      
    };

    const pins = await client.fetch(searchQuery, params);

    return new Response(JSON.stringify(pins), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
  } catch (err) {
    console.error('Search error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to perform search' }),
      { status: 500 }
    );
  }
}