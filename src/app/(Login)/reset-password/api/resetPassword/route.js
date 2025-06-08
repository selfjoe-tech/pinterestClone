import { client } from "../../../../sanity/client"
import bcrypt from 'bcryptjs';


export async function PATCH(request) {
    const { password, id } = await request.json();

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        await client
            .patch(id)
            .set({ password: hashedPassword })
            .commit();

        return new Response(
        JSON.stringify({ message: 'Password reset' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
    } catch (err) {
        return new Response(
            JSON.stringify({ error: `${err}: Failed to process request.` }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}