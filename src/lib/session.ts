import {getAuth} from 'firebase-admin/auth';
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';
import {initServerApp} from './firebase/server';

initServerApp();

interface SessionUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

interface Session {
  user: SessionUser;
  iat: number;
  exp: number;
}

export async function getSession(): Promise<Session | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await getAuth().verifySessionCookie(sessionCookie, true);
    return {
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        displayName: decodedClaims.name,
        photoURL: decodedClaims.picture,
      },
      iat: decodedClaims.iat,
      exp: decodedClaims.exp,
    };
  } catch (error) {
    console.warn('Could not verify session cookie:', error);
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) {
    // If no session, redirect to login
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Verify the session cookie. In this case an additional check is added to detect
  // if the user's Firebase session was revoked, user deleted/disabled, etc.
  try {
    const decoded = await getAuth().verifySessionCookie(session, true);
    const response = NextResponse.next();
    // Re-set the cookie to update its expiration time
    response.cookies.set('session', session, {
       maxAge: 60 * 60 * 24 * 5 * 1000,
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       path: '/',
    });
    return response;
  } catch (error) {
     // Session cookie is invalid. Clear it and redirect to login page.
    console.info('Session cookie invalid, clearing and redirecting to login');
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('session');
    return response;
  }
}
