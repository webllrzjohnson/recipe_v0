import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/** Legacy URLs used `/en/...` and `/fr/...`; the app is English-only at the root. */
function destinationWithoutLegacyLocalePrefix(pathname: string): string | null {
  if (pathname === '/en' || pathname === '/fr') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice('/en'.length) || '/';
  if (pathname.startsWith('/fr/')) return pathname.slice('/fr'.length) || '/';
  return null;
}

function isAdminLoginPath(pathname: string): boolean {
  return (
    pathname === '/admin/login' || pathname.startsWith('/admin/login?')
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const stripped = destinationWithoutLegacyLocalePrefix(pathname);
  if (stripped !== null) {
    const url = request.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.redirect(url, 308);
  }

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

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

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/admin/login';

  if (!user && !isAdminLoginPath(pathname)) {
    return NextResponse.redirect(loginUrl);
  }

  if (user && !isAdminLoginPath(pathname)) {
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      return NextResponse.redirect(loginUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*).*)',
  ],
};
