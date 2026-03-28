import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First, handle i18n routing
  const intlResponse = intlMiddleware(request);

  // Get the pathname without locale prefix
  const pathname = request.nextUrl.pathname;
  const pathnameWithoutLocale = pathname.replace(/^\/(en|fr)/, '');

  // Check if this is an admin route that needs auth protection
  if (pathnameWithoutLocale.startsWith('/admin')) {
    // Create Supabase client for auth check
    let supabaseResponse = intlResponse;

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If no user and trying to access admin (excluding login page), redirect to login
    if (!user && !pathnameWithoutLocale.startsWith('/admin/login')) {
      const locale = pathname.match(/^\/(en|fr)/)?.[1] || 'en';
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }

    // Copy cookies from intl response to ensure session is maintained
    const response = intlResponse;
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value);
    });

    return response;
  }

  return intlResponse;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next static files
    // - _next image optimization files
    // - all root files (favicon.ico, icon.*, etc.)
    '/((?!api|_next|.*\\..*).*)',
  ],
};
