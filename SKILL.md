# UI Redesign Skill — Mental Wellness Journaling App

## Төслийн танилцуулга

Энэ бол **Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui** дээр бүтээгдсэн
**сэтгэл зүйн өдрийн тэмдэглэлийн апп** юм. Хэрэглэгч нь 3 алхамт "Thought Flow"
дамжуулан сэтгэл санаагаа бичиж, AI-аар "Seed Insight" авдаг. Монгол хэлтэй.

---

## Дизайны Философи — Яг Юу Хэрэгтэй Вэ?

### Одоогийн Асуудлууд
1. **Сул зай их** — padding/margin хэт их, агуулга алга болсон мэт харагддаг
2. **Өнгөний уялдаа муу** — action color-ууд (stress, joy гэх мэт) болон base theme хоорондоо тохиромжгүй харагддаг
3. **Hierarchy тодорхойгүй** — юу чухал, юу дагалдах нь ойлгомжгүй
4. **Дизайн сэтгэл хөдөлгөдөггүй** — emotional app-д тохирсон дулаан, амьд мэдрэмж байхгүй
5. **Dark mode** — нэг хэвийн, харанхуй л болж, утга нэмдэггүй

### Зорилтот Дизайн Чиглэл
**"Warm Depth"** — Гүн, дулаан, тайвшруулах мэдрэмж. Санаа зоволтоо хуваалцах аюулгүй орон зай.

- **Өнгө**: Neutral warm base (warm gray/stone) + vibrant accent per emotion
- **Typography**: Readable, warm, slightly rounded feel — **Pretendard** эсвэл **Plus Jakarta Sans** (Монгол үсэгтэй сайн ажилладаг)
- **Spacing**: Tight but breathable — 4px grid-д нягт баримтлах
- **Cards**: Subtle elevation, soft shadows, органик feel
- **Emotions**: Тус бүрийн өнгийг илүү тод, saturated болгох — background wash биш gradient accent

---

## Файлын Бүтэц

```
app/
  globals.css              ← Tailwind import, base styles
  design-tokens.css        ← CSS custom properties (ENERGY ХЭРЭГТЭЙ)
  layout.tsx               ← Font import энд

shared/
  ui/                      ← shadcn components (button, card, dialog...)
  components/
    HomePage.tsx           ← Dashboard home — REDESIGN хэрэгтэй
    InsightCard.tsx        ← Insight display
    RateLimitBar.tsx       ← Free tier rate limit
    DashboardLayout.tsx    ← Layout wrapper
    MobileDrawer.tsx       ← Mobile nav
    DesktopSidebar.tsx     ← Desktop nav

features/
  journal/
    components/
      ThoughtFlow.tsx      ← 3-step flow container — REDESIGN хэрэгтэй
      QuickActionButton.tsx← Action selection cards — REDESIGN хэрэгтэй
      SeedInsightStep.tsx  ← AI result display — REDESIGN хэрэгтэй
      StepIndicator.tsx    ← Progress indicator
      EntryCard.tsx        ← Journal entry list item
```

---

## Design Token Стандарт

Бүх өнгийн өөрчлөлтийг `app/design-tokens.css` болон `app/globals.css`-д хийнэ.
Tailwind arbitrary value ашиглахаас зайлсхий — CSS variable ашигла.

### Шинэ Color Palette (Warm Depth)
```css
:root {
  /* ── Base — Warm Stone ────────────────────────────────── */
  --background:        oklch(0.99 0.004 85);     /* warm white */
  --foreground:        oklch(0.18 0.02 60);       /* warm near-black */
  --card:              oklch(0.97 0.006 80);      /* slightly warm card */
  --muted:             oklch(0.93 0.008 75);
  --muted-foreground:  oklch(0.52 0.018 70);
  --border:            oklch(0.88 0.01 75);

  /* ── Primary — Deep Warm Indigo ──────────────────────── */
  --primary:           oklch(0.38 0.14 280);
  --primary-foreground: oklch(0.99 0 0);

  /* ── Accent — Warm Amber ─────────────────────────────── */
  --accent:            oklch(0.72 0.14 65);
  --accent-foreground: oklch(0.18 0.02 60);
}

.dark {
  --background:        oklch(0.13 0.015 260);    /* deep cool-warm dark */
  --foreground:        oklch(0.93 0.01 80);
  --card:              oklch(0.17 0.018 255);
  --muted:             oklch(0.22 0.015 260);
  --muted-foreground:  oklch(0.58 0.02 75);
  --border:            oklch(0.28 0.018 260);

  --primary:           oklch(0.72 0.14 280);
  --primary-foreground: oklch(0.13 0.015 260);
}
```

### Action Color Refresh (илүү vibrant)
```css
:root {
  /* Stress — Deep Orange */
  --color-stress:      oklch(0.60 0.26 35);
  --color-stress-bg:   oklch(0.96 0.06 40);
  --color-stress-ring: oklch(0.80 0.14 38);

  /* Joy — Golden */
  --color-joy:         oklch(0.72 0.20 80);
  --color-joy-bg:      oklch(0.97 0.06 82);

  /* Gratitude — Rose */
  --color-gratitude:   oklch(0.62 0.24 355);
  --color-gratitude-bg: oklch(0.97 0.05 355);

  /* ... бусад мөн адил pattern-оор */
}
```

---

## Component Redesign Заавар

### 1. QuickActionButton (`features/journal/components/QuickActionButton.tsx`)
**Асуудал**: Хэт дугуй, floating, дэлгэцэнд "тогтдоггүй"
**Шийдэл**:
- Horizontal card layout (icon left, text right) — mobile-д илүү efficient
- Subtle left border accent (4px solid action color)
- Compact height (~72px), full width
- Disabled state: opacity + lock icon top-right (одоогийнх сайн, хадгална)
- Hover: translateX(2px) + shadow нэмэгдэх

```tsx
// Шинэ бүтэц (default variant):
<button className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl
                   bg-card border border-border hover:border-[var(--action-color)]
                   transition-all hover:shadow-sm hover:translate-x-0.5
                   border-l-4 border-l-[var(--action-color)]">
  <div className="p-2 rounded-xl [background:var(--action-bg)]">
    <Icon size={20} className="[color:var(--action-color)]" />
  </div>
  <div>
    <p className="text-sm font-semibold">{label}</p>
    <p className="text-xs text-muted-foreground">{sub}</p>
  </div>
  <ArrowRight size={14} className="ml-auto text-muted-foreground/40" />
</button>
```

### 2. ThoughtFlow (`features/journal/components/ThoughtFlow.tsx`)
**Асуудал**: Дэлгэцийн 30% л ашиглагддаг, textarea ганцаараа "эмгэнэлтэй" харагддаг
**Шийдэл**:
- Full-height layout — `min-h-[calc(100dvh-120px)]` flex column
- Question text: large, warm, `text-xl font-semibold` — яриа хэлэлцүүлэг мэт
- Textarea: borderless, full-width, placeholder italic — "дотоод орон зай" мэдрэмж
- Bottom bar: sticky-ish, back + progress + next — нэг мөрт

### 3. StepIndicator (`features/journal/components/StepIndicator.tsx`)
**Асуудал**: Тоон, хүйтэн
**Шийдэл**: Thin horizontal progress bar (3 segment) + step label text

### 4. SeedInsightStep (`features/journal/components/SeedInsightStep.tsx`)
**Асуудал**: Insight гурав давхар card болж "technical" харагддаг
**Шийдэл**:
- Single continuous card, sections нь divider-ээр тусгаарлагдсан
- `mirror` → "Та ингэж харлаа" label + italic quote style
- `reframe` → "Өөр өнцгөөс" label + body text
- `relief` → "Одоо хийж болох зүйл" + highlighted pill

### 5. HomePage (`shared/components/HomePage.tsx`)
**Асуудал**: Сул зай, Hawkins card тодорхойгүй
**Шийдэл**:
- Remove excessive spacing between sections (gap-3 → gap-2)
- StatRow: compact pill style, not separate cards
- HawkinsCard: gradient background (action color → transparent), number large

---

## CSS Хэрэглэх Дүрэм

1. **Margin/Padding**: `space-y-2` (8px), `space-y-3` (12px) хэрэглэ. `space-y-6`, `space-y-8` зөвхөн section separator-т.
2. **Border radius**: `rounded-2xl` (cards), `rounded-xl` (buttons), `rounded-full` (badges/pills)
3. **Typography scale**:
   - Page title: `text-xl font-bold`
   - Section header: `text-sm font-semibold uppercase tracking-wide text-muted-foreground`
   - Body: `text-sm`
   - Caption: `text-xs text-muted-foreground`
4. **Shadow**: `shadow-sm` хангалттай. `shadow-md` hover-т.
5. **Transition**: `transition-all duration-150` эсвэл `duration-200` — ихэнх hover effect-т

---

## Хэрэгжүүлэх Дараалал (TODO.md-тэй тааруулна)

1. `design-tokens.css` — color palette refresh
2. `QuickActionButton.tsx` — horizontal card redesign
3. `StepIndicator.tsx` — progress bar болгох
4. `ThoughtFlow.tsx` — layout + spacing fix
5. `SeedInsightStep.tsx` — unified card, better typography
6. `HomePage.tsx` — spacing tighten, stat row compact
7. `EntryCard.tsx` — list item polish
8. `button.tsx` (shared/ui) — primary button style refresh