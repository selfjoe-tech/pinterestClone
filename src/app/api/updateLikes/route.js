import { client } from '../../../sanity/client';
import { nanoid } from 'nanoid';

export async function PATCH(request) {
  try {
    const { pinId, likes, userId, addPin } = await request.json();
    
    if (!pinId|| typeof likes !== 'number') {
        return new Response(
          JSON.stringify({ error: 'Invalid pinId or likes' }),
          { status: 400 ,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

    await client
      .patch(pinId)
      .set({ likes })
      .commit();

    const userPatch = client.patch(userId).setIfMissing({ likedPins: [] });

    if (addPin) {
      userPatch.append(
        'likedPins',
        [
          { 
            _key: nanoid(), 
          _ref: pinId 
          }
        ]
      );
    } else {
      userPatch.unset([`likedPins[_ref=="${pinId}"]`]);
    }

    await userPatch.commit();
    

    return new Response(JSON.stringify({ likes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });


  } catch (err) {
    console.error('Error updating likes:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to update likes' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}