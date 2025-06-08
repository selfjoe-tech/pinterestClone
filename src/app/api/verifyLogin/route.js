import bcrypt from 'bcryptjs';
import { client } from "../../../sanity/client";
import {confirmLoginQuery} from "../../utilitis/apis/queries"
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';


const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const user = await client.fetch(confirmLoginQuery, { email });

    if (!user) {
      return new Response(JSON.stringify({ error: "This email isn't registered. Click Sign Up to create an account" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const accessToken = jwt.sign({ userId: user._id }, secret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, refreshSecret, { expiresIn: '7d' });

    const accessCookie = serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60, // 15 minutes in seconds
    });
    
    const refreshCookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3 * 24 * 60 * 60,
    });
    const decoded = jwt.verify(accessToken, secret);

    return new Response(JSON.stringify(
      {
      isLoggedIn: true,
      user: { 
              _id: user._id,
              userName: user.userName,
              profileImage: user.profileImage,
              likedPins: user.likedPins,
              followers: user.followers,
              following: user.followering
            },
      tokenExpiry: decoded.exp
      }
    ), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': [accessCookie, refreshCookie]
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}