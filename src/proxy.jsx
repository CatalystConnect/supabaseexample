import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

  // getUser() may refresh an expired session, which writes new auth cookies
  // onto `response`. A plain NextResponse.redirect() would drop them, so any
  // redirect has to copy them over or the refreshed session is lost.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirectTo = (path) => {
    const redirect = NextResponse.redirect(new URL(path, request.url));
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  const pathname = request.nextUrl.pathname;

  // logged in user should not see login
  if (user && pathname === "/") {
    return redirectTo("/dashboard");
  }

  // not logged in user should not access dashboard
  if (!user && pathname.startsWith("/dashboard")) {
    return redirectTo("/");
  }

  return response;
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
