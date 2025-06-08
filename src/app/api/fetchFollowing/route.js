import { client } from '@/sanity/client'
import { userFollowDataQuery } from '@/app/utilitis/apis/queries'

export async function POST(request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return new Response(JSON.stringify(
        { error: 'Missing userId' }),
        { status: 400,
            headers: {
                'Content-Type': 'application/json' 
            } 
         }
      )
    }

    const user = await client.fetch(userFollowDataQuery, { userId })

    if (!user) {
      return new Response(JSON.stringify(
        { error: 'User not found' }),
        { status: 404,
            headers: {
                'Content-Type': 'application/json' 
            } 
         }
      )
    }

    return new Response(JSON.stringify(user),
      { status: 200,
        headers: {
            'Content-Type': 'application/json' 
        } 
       }
    )
  } catch (error) {
    console.error('Error fetching followers/following:', error)
    return new Response(JSON.stringify(
      { error: 'Internal server error' }),
      { status: 500,
        headers: {
            'Content-Type': 'application/json' 
        } 
       }
    )
  }
}
