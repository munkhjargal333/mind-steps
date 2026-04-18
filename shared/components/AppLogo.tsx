// shared/components/AppLogo.tsx
// ─────────────────────────────────────────────────────────────────────────────


import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

interface AppLogoProps {
  variant?: 'icon' | 'wordmark' | 'full';
  size?: 'sm' | 'md' | 'lg';
  href?: string | false;   // false → не ссылка
  className?: string;
}

// ── Icon sizes ─────────────────────────────────────────────────────────────
const ICON_SIZE = { sm: 30, md: 36, lg: 48 };
const TEXT_SIZE = {
  sm: { name: '1.0rem',  sub: '0.58rem' },
  md: { name: '1.1rem',  sub: '0.65rem' },
  lg: { name: '1.5rem',  sub: '0.75rem' },
};

// ── SVG mark — sun rays + inner circle (MindSteps) ─────────────────────────
function LogoMark({ px }: { px: number }) {
  const r = px / 2;
  const inner = r * 0.38;
  const rayLen = r * 0.22;
  const rayStart = inner + r * 0.10;

  // 8 rays at 0, 45, 90 … 315°
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
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="var(--brand-amber)" />
          <stop offset="100%" stopColor="var(--brand-terracotta)" />
        </linearGradient>
      </defs>

      {/* Background pill */}
      <rect
        width={px}
        height={px}
        rx={px * 0.28}
        fill="url(#logo-grad)"
      />

      {/* Rays */}
      {rays.map((ray, i) => (
        <line
          key={i}
          x1={ray.x1} y1={ray.y1}
          x2={ray.x2} y2={ray.y2}
          stroke="white"
          strokeWidth={px * 0.055}
          strokeLinecap="round"
          opacity={i % 2 === 0 ? 1 : 0.65}
        />
      ))}

      {/* Core circle */}
      <circle cx={r} cy={r} r={inner} fill="white" opacity={0.95} />

      {/* Inner dot */}
      <circle cx={r} cy={r} r={inner * 0.32} fill="url(#logo-grad)" />
    </svg>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────

export function AppLogo({
  variant = 'wordmark',
  size = 'sm',
  href = '/',
  className,
}: AppLogoProps) {
  const px = ICON_SIZE[size];
  const ts = TEXT_SIZE[size];

  const inner = (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark px={px} />

      {variant !== 'icon' && (
        <span className="flex flex-col leading-none" style={{ gap: '2px' }}>
          <span
            className="font-bold tracking-tight"
            style={{ fontSize: ts.name, color: 'var(--foreground)', letterSpacing: '-0.02em' }}
          >
            MindSteps
          </span>
          {variant === 'full' && (
            <span
              className="uppercase tracking-widest font-medium"
              style={{ fontSize: ts.sub, color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}
            >
              Сэтгэл зүйн туслах
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (href === false) return inner;

  return (
    <Link href={href} className="transition-opacity hover:opacity-80 inline-flex">
      {inner}
    </Link>
  );
}