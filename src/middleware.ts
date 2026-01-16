import {NextResponse, type NextRequest} from 'next/server';
import {updateSession} from '@/lib/session';

const PROTECTED_ROUTES = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    return await updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
