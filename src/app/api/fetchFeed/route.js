import { client } from '../../../sanity/client';
import {feedQuery} from "../../utilitis/apis/queries"

export async function GET() {
  try {
    const feedData = await client.fetch(feedQuery);
    
    return new Response(JSON.stringify(feedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching feed data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch feed data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}