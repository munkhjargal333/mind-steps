module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/permissions.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PERMISSIONS",
    ()=>PERMISSIONS,
    "TIERS",
    ()=>TIERS,
    "TIER_LABEL",
    ()=>TIER_LABEL,
    "can",
    ()=>can
]);
const TIERS = [
    'free',
    'demo',
    'pro'
];
const PERMISSIONS = {
    view_insights: [
        "free",
        'pro'
    ],
    view_emotions: [
        "free",
        'pro'
    ],
    view_graph: [
        "free",
        'pro'
    ]
};
function can(tier, permission) {
    return PERMISSIONS[permission].includes(tier);
}
const TIER_LABEL = {
    pro: 'PRO',
    premium: 'PRE'
};
}),
"[project]/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
// middleware.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$permissions$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/permissions.ts [middleware] (ecmascript)");
;
;
;
const PUBLIC_PATHS = [
    '/',
    '/login',
    '/terms',
    '/privacy',
    '/unauthorized',
    '/join',
    '/about',
    '/demo',
    '/upgrade'
];
const PROTECTED_ROUTES = [
    {
        path: '/insights',
        permission: 'view_insights'
    },
    {
        path: '/emotions',
        permission: 'view_emotions'
    },
    {
        path: '/graph',
        permission: 'view_graph'
    }
];
/**
 * JWT-ийн app_metadata-аас tier-ийг унших функц.
 * Хэрэглэгч өөрөө засах боломжгүй хэсэг (app_metadata) тул аюулгүй.
 */ function resolveTierFromAuth(user) {
    const tier = user?.app_metadata?.tier;
    const validTiers = [
        'demo',
        'pro',
        'free'
    ];
    if (typeof tier === 'string' && validTiers.includes(tier)) {
        return tier;
    }
    return 'free';
}
async function proxy(request) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const { pathname } = request.nextUrl;
    // 1. Нийтэд нээлттэй зам эсэхийг шалгах
    const isPublicPath = PUBLIC_PATHS.some((p)=>pathname === p) || pathname.startsWith('/auth/');
    // Static болон Service Worker файлуудыг алгасах
    if (pathname.startsWith('/sw.js') || pathname.startsWith('/workbox') || pathname === '/manifest.json') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    let response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request: {
            headers: request.headers
        }
    });
    // 2. Supabase Client үүсгэх
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://kjeuusghmtmsozqsabwx.supabase.co"), ("TURBOPACK compile-time value", "sb_publishable_msrbfQImI0-nSlmET-EwIA_77fIGppE"), {
        cookies: {
            getAll () {
                return request.cookies.getAll();
            },
            setAll (cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options })=>request.cookies.set(name, value));
                response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
                    request: {
                        headers: request.headers
                    }
                });
                cookiesToSet.forEach(({ name, value, options })=>response.cookies.set(name, value, options));
            }
        }
    });
    // 3. JWT-ээс хэрэглэгчийг унших (Энэ нь Metadata-г давхар авчирна)
    const { data: { user }, error } = await supabase.auth.getUser();
    if ("TURBOPACK compile-time truthy", 1) {
        console.log(`[MW] ${pathname} | User: ${user?.email ?? 'Guest'} | Tier: ${user?.app_metadata?.tier ?? 'demo'}`);
    }
    // 4. Нэвтрээгүй хэрэглэгчийг хамгаалах
    if (!isPublicPath && !user) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('next', pathname); // Нэвтэрсний дараа буцаж ирэх замыг хадгалах
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    // 5. Нэвтэрсэн хэрэглэгч /login руу орохыг оролдвол
    if (pathname === '/login' && user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/home', request.url));
    }
    // 6. Tier/Permission шалгах
    if (user) {
        const tier = resolveTierFromAuth(user);
        const matched = PROTECTED_ROUTES.find((r)=>pathname.startsWith(r.path));
        if (matched && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$permissions$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["can"])(tier, matched.permission)) {
            const url = new URL('/unauthorized', request.url);
            url.searchParams.set('from', pathname);
            url.searchParams.set('tier', tier);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
    }
    return response;
}
const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b5605273._.js.map