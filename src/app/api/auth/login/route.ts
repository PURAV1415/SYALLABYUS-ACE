import {NextResponse} from 'next/server';
import {getAuth} from 'firebase-admin/auth';
import {initServerApp} from '@/lib/firebase/server';
import {cookies} from 'next/headers';

initServerApp();

export async function POST(request: Request) {
  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!idToken) {
    return NextResponse.json({error: 'No token provided'}, {status: 401});
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await getAuth().createSessionCookie(idToken, {expiresIn});
    
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({status: 'success', uid: decodedToken.uid});
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }
}
