import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired
  await supabase.auth.getUser();

  // Check authentication for protected routes
  if (request.nextUrl.pathname.startsWith('/protected') || 
      request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/sessions') ||
      request.nextUrl.pathname.startsWith('/players') ||
      request.nextUrl.pathname.startsWith('/profile')) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/protected/:path*', '/dashboard/:path*', '/sessions/:path*', '/players/:path*', '/profile/:path*'],
};
