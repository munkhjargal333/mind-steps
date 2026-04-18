// middleware.ts  (root-д байрлана: /middleware.ts)
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { can, type Permission, type Tier } from '@/shared/constants/index'

// ── Нийтэд нээлттэй замууд ────────────────────────────────────
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/terms',
  '/privacy',
  '/join',
  '/demo',
  '/upgrade',
  '/unauthorized',
]

// ── Tier permission шаарддаг замууд ──────────────────────────
// PERMISSIONS-д байгаа бүх permission-тай тааруулна
const PROTECTED_ROUTES: { path: string; permission: Permission }[] = [
  { path: '/insights',  permission: 'view_insights' },
  { path: '/emotions',  permission: 'view_emotions' },
  { path: '/graph',     permission: 'view_graph'    },
]

// ── app_metadata-аас tier унших ───────────────────────────────
// app_metadata нь хэрэглэгч өөрөө засах боломжгүй — аюулгүй
function resolveTier(user: any): Tier {
  const tier = user?.app_metadata?.tier
  if (tier === 'pro' || tier === 'premium') return 'pro'  // premium → pro-д map
  if (tier === 'demo') return 'demo'
  return 'free'
}

// ── proxy ────────────────────────────────────────────────
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API route-уудыг алгасах — тэдгээр нь өөрсдөө шалгана
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Static / PWA файлуудыг алгасах
  if (
    pathname.startsWith('/sw.js') ||
    pathname.startsWith('/workbox') ||
    pathname === '/manifest.json'
  ) {
    return NextResponse.next()
  }

  const isPublicPath =
    PUBLIC_PATHS.some(p => pathname === p) ||
    pathname.startsWith('/auth/')

  // Response объектыг урьдчилан үүсгэх (cookie refresh-д хэрэгтэй)
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // ── Supabase SSR client ──────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // ── JWT-ээс хэрэглэгч унших ──────────────────────────────────
  // getUser() нь server-side validation хийдэг (getSession()-с илүү аюулгүй)
  const { data: { user } } = await supabase.auth.getUser()

  if (process.env.NODE_ENV === 'development') {
    const tier = user ? resolveTier(user) : 'guest'
    console.log(`[MW] ${pathname} | ${user?.email ?? 'Guest'} | tier: ${tier}`)
  }

  // ── 1. Нэвтрээгүй хэрэглэгч protected route руу орохыг хориглох
  if (!isPublicPath && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── 2. Нэвтэрсэн хэрэглэгч /login руу ороход /home руу шилжүүлэх
  if (pathname === '/login' && user) {
    // ?next param байвал тэр рүү, үгүй бол /home
    const next = request.nextUrl.searchParams.get('next') ?? '/home'
    const safeNext = next.startsWith('/') ? next : '/home'  // Open redirect хориглох
    return NextResponse.redirect(new URL(safeNext, request.url))
  }

  // ── 3. Tier / Permission шалгах ─────────────────────────────
  if (user) {
    const tier = resolveTier(user)
    const matched = PROTECTED_ROUTES.find(r => pathname.startsWith(r.path))

    if (matched && !can(tier, matched.permission)) {
      const url = new URL('/unauthorized', request.url)
      url.searchParams.set('from', pathname)
      url.searchParams.set('tier', tier)
      return NextResponse.redirect(url)
    }
  }

  return response
}

// ── Matcher: _next/static, image, favicon зэргийг орхих ───────
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}