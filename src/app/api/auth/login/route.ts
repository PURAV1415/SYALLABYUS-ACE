import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';

export async function POST(request: Request) {
  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!idToken) {
    return NextResponse.json({error: 'No token provided'}, {status: 401});
  }

  try {
    const {initServerApp} = await import('@/lib/firebase/server');
    const {getAuth} = await import('firebase-admin/auth');

    await initServerApp();
    
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
  } catch (error: any) {
    console.error('Error verifying ID token:', error);
    if (error.message?.includes('Firebase Admin SDK credentials are not set')) {
      return NextResponse.json({ error: 'Authentication service is not configured on the server.' }, { status: 500 });
    }
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }
}
