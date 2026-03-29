import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const localePattern = routing.locales.join('|');

function pathnameWithoutLocaleSegment(pathname: string): string {
  return pathname.replace(new RegExp(`^\\/(${localePattern})`), '') || '/';
}

function localeFromPathname(pathname: string): string {
  const match = pathname.match(new RegExp(`^\\/(${localePattern})(?:\\/|$)`));
  return match?.[1] ?? routing.defaultLocale;
}

function isAdminLoginPath(pathWithoutLocale: string): boolean {
  return (
    pathWithoutLocale === '/admin/login' ||
    pathWithoutLocale.startsWith('/admin/login?')
  );
}

export async function middleware(request: NextRequest) {
  // First, handle i18n routing
  const intlResponse = intlMiddleware(request);

  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = pathnameWithoutLocaleSegment(pathname);

  if (pathWithoutLocale.startsWith('/admin')) {
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

    const locale = localeFromPathname(pathname);
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}/admin/login`;

    if (!user && !isAdminLoginPath(pathWithoutLocale)) {
      return NextResponse.redirect(loginUrl);
    }

    if (
      user &&
      !isAdminLoginPath(pathWithoutLocale)
    ) {
      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile?.is_admin) {
        return NextResponse.redirect(loginUrl);
      }
    }

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
