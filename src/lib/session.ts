import {cookies} from 'next/headers';

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
    const {initServerApp} = await import('./firebase/server');
    const {getAuth} = await import('firebase-admin/auth');

    await initServerApp();
    
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
    // If the cookie is invalid, delete it.
    cookies().delete('session');
    return null;
  }
}
