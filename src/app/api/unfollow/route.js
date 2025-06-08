import { client } from '../../../sanity/client'

export async function POST(request) {
  try {
    const { userId, targetUserId } = await request.json()
    if (!userId || !targetUserId) {
      return new Response(JSON.stringify(
        { error: 'Missing userId or targetUserId' }),
        { status: 400, 
            headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // 1. Remove from this user’s “following”
    const userUpdate = client
      .patch(userId)
      // unset any entry whose _ref matches targetUserId
      .unset([`following[_ref=="${targetUserId}"]`])

    // 2. Remove from target user’s “followers”
    const targetUpdate = client
      .patch(targetUserId)
      .unset([`followers[_ref=="${userId}"]`])

    // Commit both patches in parallel
    const [updatedUser, updatedTarget] = await Promise.all([
      userUpdate.commit({ returnDocuments: true }),
      targetUpdate.commit({ returnDocuments: true }),
    ])

    return new Response(JSON.stringify(
      {
        following: updatedUser.following,
        followers: updatedTarget.followers,
      }),
      { status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (err) {
    console.error('Error in /api/unfollow:', err)
    return new Response(JSON.stringify(
      { error: 'Internal server error' }),
      { status: 500,
        headers: { 'Content-Type': 'application/json' }
       }
    )
  }
}