import { client } from '../../../sanity/client';
import { categoryFeedQuery } from '../../utilitis/apis/queries';

export async function POST(req) {
  try {
    const { categoryTitle } = await req.json();

    if (!categoryTitle) {
      return new Response(JSON.stringify({ error: 'Category title is required.' }), 
        { 
            status: 400, 
            headers: { 'Content-Type': 'application/json' }
      });
    };
    
    const pins = await client.fetch(categoryFeedQuery, { categoryTitle });

    return new Response(JSON.stringify(pins), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching pins by category:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch pins' }), 
        { 
            status: 500,
            headers: { 'Content-Type': 'application/json' },
     });
  }
}