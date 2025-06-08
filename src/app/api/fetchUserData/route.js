import { client } from '../../../sanity/client';
import { userProfileQuery } from "../../utilitis/apis/queries"

export async function POST(request) {
  
  try {
    const { userId } = await request.json();
    console.log(userId)
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }),
        {   status: 400, 
            headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const userDoc = await client.fetch(userProfileQuery, { userId });
    console.log(userDoc)
    if (!userDoc) {
      return new Response(JSON.stringify({ error: "User not found" }), 
      { status: 404,
        headers: {
          'Content-Type': 'application/json' 
          }  
      }
      );
    }

    return new Response(JSON.stringify(userDoc), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

  } catch (err) {
    return new Response(
        JSON.stringify({ error: `Failed to fetch ${err}` }),
        { status: 500, headers: {
            'Content-Type': 'application/json' 
            } 
        }
    );
  }
}