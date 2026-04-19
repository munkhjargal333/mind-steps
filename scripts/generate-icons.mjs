import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ICON_DIR = './public/icons';
// Хэрэв public/icons хавтас байхгүй бол үүсгэнэ
if (!fs.existsSync(ICON_DIR)) {
    fs.mkdirSync(ICON_DIR, { recursive: true });
}

// MindSteps-ийн үндсэн Amber Gradient өнгөнүүд
const colors = {
    start: '#f59e0b', // amber-500
    end: '#d97706'    // amber-600
};

// PWA-д шаардлагатай хэмжээсүүд
const sizes = [
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'maskable-icon.png', size: 512, padding: true }
];

async function generateIcons() {
    console.log('🚀 Icon үүсгэж эхэллээ...');

    // Энгийн SVG лого (Чиний AppLogo-г төлөөлөх дизайн)
    // Энд байгаа <path> нь жишээ бөгөөд "MindSteps"-ийн лого байхаар тохируулж болно
    const svgLogo = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors.start};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${colors.end};stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="512" height="512" rx="100" fill="url(#grad)" />
        <path d="M150 350 L250 250 L350 350" stroke="white" stroke-width="40" fill="none" stroke-linecap="round"/>
        <circle cx="250" cy="180" r="40" fill="white" />
    </svg>`;

    for (const item of sizes) {
        let pipeline = sharp(Buffer.from(svgLogo));

        if (item.padding) {
            // Android Maskable icon-д зориулсан safe-zone padding
            pipeline = pipeline.resize(item.size, item.size, {
                fit: 'contain',
                background: { r: 245, g: 158, b: 11, alpha: 1 }
            });
        } else {
            pipeline = pipeline.resize(item.size, item.size);
        }

        await pipeline.toFile(path.join(ICON_DIR, item.name));
        console.log(`✅ Үүслээ: ${item.name}`);
    }

    console.log('✨ Бүх icon-ууд амжилттай public/icons/ дотор хадгалагдлаа!');
}

generateIcons().catch(console.error);