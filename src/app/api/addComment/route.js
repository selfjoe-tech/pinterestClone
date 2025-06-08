import { client } from '../../../sanity/client';
import {fetchCommentQuery} from "../../utilitis/apis/queries"
import { nanoid } from 'nanoid';


export async function POST(request) {
  try {
    const { pinId, text, postedById } = await request.json();
    if (!pinId || !text || !postedById) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const newCommentDoc = await client.create({
      _type: "comment",
      text,
      postedBy: { _ref: postedById },
      pin: { _ref: pinId },
      createdAt: new Date().toISOString(),
    });

    // Patch the pin document to add a reference to the new comment
    await client
      .patch(pinId)
      .append("comments", [
        { 
          _key: nanoid(),               // <-- unique key
          _ref: newCommentDoc._id
        }
      ])
      .commit();

    // Fetch the fully resolved comment for return
    const newComment = await client.fetch(fetchCommentQuery, { commentId: newCommentDoc._id });
    return new Response(JSON.stringify(newComment), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return new Response(JSON.stringify({ error: "Failed to add comment" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}