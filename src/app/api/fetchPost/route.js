import { postQuery } from '../../utilitis/apis/queries'
import { client } from '../../../sanity/client'

export async function POST(request) {

  try {
    const { pinId } = await request.json();
 
    if (!pinId) {
      return new Response(JSON.stringify(
        { error: 'No pinId provided' }
      ), 
        { status: 400,
         headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const postData = await client.fetch(postQuery, { pinId })
    return new Response(JSON.stringify(postData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('Error in /api/fetchPost:', err)
    return new Response(JSON.stringify({ error: 'Failed to fetch feed data' }),
        { status: 500,
          headers: { 'Content-Type': 'application/json' } 
        }
    )
  }
}
