import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const refreshTokenMatch = cookieHeader.match(/refreshToken=([^;]+)/);
    const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;
    
    if (!refreshToken) {
      return new Response(JSON.stringify({ error: "Refresh token missing" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
      return new Response(JSON.stringify({ error: `Invalid refresh token: ${err}` }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Issue new access token
    const newAccessToken = jwt.sign({ userId: decoded.userId }, secret, { expiresIn: '15m' });
    const newAccessCookie = serialize('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60,
    });
    const decodedNew = jwt.verify(newAccessToken, secret);
    
    return new Response(JSON.stringify(
        { 
          accessToken: newAccessToken, 
          tokenExpiry: decodedNew.exp 
        }
      ), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': newAccessCookie,
        }
      }
  );
  } catch (error) {
    console.error('Refresh token error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}