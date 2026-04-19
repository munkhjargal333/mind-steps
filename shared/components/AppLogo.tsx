// shared/components/AppLogo.tsx
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

interface AppLogoProps {
  variant?: 'icon' | 'wordmark' | 'full';
  size?: 'sm' | 'md' | 'lg';
  href?: string | false; // false өгвөл Link-гүй болно
  className?: string;
}

const ICON_SIZE = { sm: 30, md: 36, lg: 48 };
const TEXT_SIZE = {
  sm: { name: '1.0rem', sub: '0.58rem' },
  md: { name: '1.1rem', sub: '0.65rem' },
  lg: { name: '1.5rem', sub: '0.75rem' },
};

function LogoMark({ px }: { px: number }) {
  const r = px / 2;
  const inner = r * 0.38;
  const rayLen = r * 0.22;
  const rayStart = inner + r * 0.10;

  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x1: r + cos * rayStart,
      y1: r + sin * rayStart,
      x2: r + cos * (rayStart + rayLen),
      y2: r + sin * (rayStart + rayLen),
    };
  });

  return (
    <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" /> {/* amber-500 */}
          <stop offset="100%" stopColor="#d97706" /> {/* amber-600 */}
        </linearGradient>
      </defs>
      <rect width={px} height={px} rx={px * 0.28} fill="url(#logo-grad)" />
      {rays.map((ray, i) => (
        <line key={i} x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2} stroke="white" strokeWidth={px * 0.055} strokeLinecap="round" opacity={i % 2 === 0 ? 1 : 0.65} />
      ))}
      <circle cx={r} cy={r} r={inner} fill="white" opacity={0.95} />
      <circle cx={r} cy={r} r={inner * 0.32} fill="url(#logo-grad)" />
    </svg>
  );
}

export function AppLogo({ variant = 'wordmark', size = 'sm', href = '/', className }: AppLogoProps) {
  const px = ICON_SIZE[size];
  const ts = TEXT_SIZE[size];

  // Дотор талын контент (SVG + Text)
  const content = (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark px={px} />
      {variant !== 'icon' && (
        <span className="flex flex-col leading-none" style={{ gap: '2px' }}>
          <span className="font-bold tracking-tight text-stone-100" style={{ fontSize: ts.name, letterSpacing: '-0.02em' }}>
            MindSteps
          </span>
          {variant === 'full' && (
            <span className="uppercase tracking-widest font-medium text-stone-500" style={{ fontSize: ts.sub, letterSpacing: '0.08em' }}>
              Ухаалаг тэмдэглэл
            </span>
          )}
        </span>
      )}
    </div>
  );

  // Хэрэв href={false} бол зүгээр л div буцаана
  if (href === false) {
    return content;
  }

  // Эсвэл Link-ээр ороож буцаана
  return (
    <Link href={href} className="transition-opacity hover:opacity-80 inline-flex">
      {content}
    </Link>
  );
}