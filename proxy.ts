// middleware.ts  (root-д байрлана: /middleware.ts)
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { can, type Permission, type Tier } from '@/shared/constants/index'

// ── Нэвтрэхгүйгээр нээлттэй замууд ─────────────────────────
const PUBLIC_PATHS = new Set([
  '/',
  '/login',
  '/terms',
  '/privacy',
  '/join',
  '/demo',
  '/unauthorized',
])

// Prefix-оор нээлттэй замууд (sub-path-уудыг хамруулна)
const PUBLIC_PREFIXES = ['/auth/', '/api/']

// ── Auth хэрэглэгчийг нэвтрүүлдэггүй замууд ─────────────────
// (нэвтэрсэн байхад эдгээрт ороход /home руу шилжүүлнэ)
const AUTH_ONLY_PATHS = new Set(['/login', '/join', '/demo'])

// ── Tier permission шаарддаг замууд ──────────────────────────
const PROTECTED_ROUTES: { path: string; permission: Permission }[] = [
  { path: '/insights',  permission: 'view_insights' },
  { path: '/emotions',  permission: 'view_emotions' },
  { path: '/graph',     permission: 'view_graph'    },
]

// ── Static/PWA файлуудын extension ──────────────────────────
const STATIC_EXT = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|css|js|map)$/

// ── app_metadata-аас tier унших ──────────────────────────────
function resolveTier(user: any): Tier {
  const tier = user?.app_metadata?.tier
  if (tier === 'pro' || tier === 'premium') return 'pro'
  if (tier === 'demo') return 'demo'
  return 'free'
}

// ── Замыг нийтэд нээлттэй эсэх шалгах ──────────────────────
function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true
  return PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

// ── proxy ────────────────────────────────────────────────
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Static файл, PWA — шууд дамжуулах
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/workbox') ||
    pathname === '/sw.js' ||
    pathname === '/manifest.json' ||
    STATIC_EXT.test(pathname)
  ) {
    return NextResponse.next()
  }

  // 2. Response объект нэг л газар үүсгэх (cookie refresh-д аюулгүй)
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 3. Supabase SSR client — official cookie pattern
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Request болон response хоёуланд тохируулах — Supabase SSR шаардлага
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 4. Session шалгах + refresh
  //    - getSession() нь access token expire болсон үед refresh_token ашиглан
  //      шинэ token авч, cookie-д бичдэг → browser-д шинэ token очно
  //    - getUser() нь Supabase server-рүү verify хийдэг → аюулгүй, tamper-proof
  //    - Нийтэд нээлттэй замд хоёуланг дуудахгүй → lag байхгүй
  const publicPath = isPublic(pathname)

  let user: any = null
  if (!publicPath || AUTH_ONLY_PATHS.has(pathname)) {
    // Эхлээд refresh trigger хийнэ (expire болсон token-г шинэчилнэ)
    await supabase.auth.getSession()
    // Дараа нь server-side verify хийнэ
    const { data } = await supabase.auth.getUser()
    user = data.user
  }

  // dev logging
  if (process.env.NODE_ENV === 'development') {
    const tier = user ? resolveTier(user) : 'guest'
    console.log(`[MW] ${request.method} ${pathname} | ${user?.email ?? 'guest'} | tier:${tier}`)
  }

  // ── Rule 1: Нэвтрээгүй хэрэглэгч protected route руу орохыг хориглох
  if (!publicPath && !user) {
    const loginUrl = new URL('/login', request.url)
    // /home → /login?next=/home гэх мэт хадгална
    if (pathname !== '/home') {
      loginUrl.searchParams.set('next', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // ── Rule 2: Нэвтэрсэн хэрэглэгч auth-only page-д ороход /home руу шилжүүлэх
  if (AUTH_ONLY_PATHS.has(pathname) && user) {
    const next = request.nextUrl.searchParams.get('next') ?? ''
    // Open redirect хориглох: зөвхөн /path хэлбэртэй, өөр origin биш
    const safe =
      next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/login')
        ? next
        : '/home'
    return NextResponse.redirect(new URL(safe, request.url))
  }

  // ── Rule 3: Tier / Permission шалгах
  if (user) {
    const tier    = resolveTier(user)
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

// ── Matcher: Next.js internal, static asset-уудыг орхих ──────
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)$).*)',
  ],
}