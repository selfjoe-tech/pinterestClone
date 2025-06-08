import { client } from '../../../sanity/client';
import { userRelationsQuery } from "../../utilitis/apis/queries"

export async function POST(request) {

  try {
    const { userId } = await request.json();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }),
        {   status: 400, 
            headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const userDoc = await client.fetch(userRelationsQuery, { userId });
    if (!userDoc) {
      console.warn("→ No user found for", userId);
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
        JSON.stringify({ error: `Failed to fetch user details ${err}` }),
        { status: 500, headers: {
            'Content-Type': 'application/json' 
            } 
        }
    );
  }
}