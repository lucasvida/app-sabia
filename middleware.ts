import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let response = NextResponse.next({ request });

  try {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();

    if (!url || !key) {
      if (pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return response;
    }

    const cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[] = [];

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach((cookie) => cookiesToSet.push(cookie));
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Proteger rotas do dashboard: redirecionar para login se não autenticado
    if (pathname.startsWith("/dashboard")) {
      if (!user) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    cookiesToSet.forEach(({ name, value, options }) => {
      try {
        response.cookies.set(name, value, options as Record<string, unknown>);
      } catch {
        // ignora falha ao setar cookie
      }
    });
  } catch {
    // Se algo falhar (Supabase, rede, etc.), deixa a requisição seguir
    response = NextResponse.next({ request });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
