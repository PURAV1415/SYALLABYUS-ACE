import {NextResponse, type NextRequest} from 'next/server';

const PROTECTED_ROUTES = ['/dashboard'];

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
