import { client } from '../../../sanity/client'
import { nanoid } from 'nanoid';

export async function POST(request) {
  try {
    const { userId, targetUserId } = await request.json()
    if (!userId || !targetUserId) {
      return new Respose(JSON.stringify(
        { error: 'Missing userId or targetUserId' }),
        {   
            status: 400, 
            headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const userUpdate = client
      .patch(userId)
      .setIfMissing({ following: [] })
      .append('following', [{ _key: nanoid(), _ref: targetUserId }])

    const targetUpdate = client
      .patch(targetUserId)
      .setIfMissing({ followers: [] })
      .append('followers', [{ _key: nanoid(), _ref: userId }])

    const [updatedUser, updatedTarget] = await Promise.all([
      userUpdate.commit({ returnDocuments: true }),
      targetUpdate.commit({ returnDocuments: true }),
    ])

    return new Response(JSON.stringify(
      { 
        following: updatedUser.following,
        followers: updatedTarget.followers
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (err) {
    console.error('Error in /api/follow:', err)
    return new Response(JSON.stringify(
        { error: 'Internal server error' }
    ),
        { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        }
    )
  }
}