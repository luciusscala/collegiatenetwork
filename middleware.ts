import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith('/protected')) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/protected/:path*'],
};
