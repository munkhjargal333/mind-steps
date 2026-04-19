import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MindSteps',
    short_name: 'MindSteps',
    description: 'Ухаалаг тэмдэглэлийн дэвтэр',
    start_url: '/home',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',

    // Design tokens-оос: light background ≈ #FAF7F4, amber brand
    background_color: '#FAF7F4',
    theme_color: '#F59E0B',       // amber-500 — AppLogo-тай таарна

    categories: ['health', 'lifestyle', 'productivity'],
    lang: 'mn',
    dir: 'ltr',

    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',      // Android adaptive icon
      },
    ],

    // Home screen дээрх shortcuts (Android long-press, iOS не дэмждэг)
    shortcuts: [
      {
        name: 'Тэмдэглэл бичих',
        short_name: 'Бичих',
        description: 'Шинэ тэмдэглэл нэмэх',
        url: '/write',
        icons: [{ src: '/icons/shortcut-write.png', sizes: '96x96' }],
      },
      {
        name: 'Тэмдэглэлүүд',
        short_name: 'Тэмдэглэл',
        description: 'Өмнөх тэмдэглэлүүдийг харах',
        url: '/entries',
        icons: [{ src: '/icons/shortcut-entries.png', sizes: '96x96' }],
      },
    ],

    screenshots: [
      {
        src: '/screenshots/mobile.png',
        sizes: '390x844',
        type: 'image/png',
        // @ts-ignore — Next.js type-д form_factor байхгүй ч Chrome дэмждэг
        form_factor: 'narrow',
        label: 'MindSteps гар утасны хэлбэр',
      },
    ],
  }
}