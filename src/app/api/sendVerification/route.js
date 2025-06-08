import { serialize } from 'cookie';
import mailCode from '../../utilitis/apis/verification_mailer'

export async function POST(request) {
  try {
    const { email, password, username } = await request.json();

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

    mailCode({ email, generatedCode });

    const cookies = [
      serialize('verificationCode', generatedCode, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
        maxAge: 180,
      }),
      serialize('userPassword', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
        maxAge: 180,
      }),
      serialize('userName', username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
        maxAge: 180,
      }),
      serialize('userEmail', email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
        maxAge: 180,
      }),
    ];

    return new Response(
      JSON.stringify({ message: 'Verification email sent.' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookies,
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `${err}: Failed to process request.` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}