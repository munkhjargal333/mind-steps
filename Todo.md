# UI Redesign — TODO List

> **Зорилго**: Logic-г огт өөрчлөхгүйгээр зөвхөн visual/UI layer-г сайжруулах.
> **Философи**: "Warm Depth" — дулаан, нягт, сэтгэл хөдөлгөм дизайн.
> **Заавар файл**: `SKILL.md` — дэлгэрэнгүй code pattern, color token, дүрэм бүгд тэнд.

---

## 🎨 PHASE 1 — Design Foundation (Эхлэх цэг)

### TASK 1.1 — Color Palette Refresh
**Файл**: `app/design-tokens.css` + `app/globals.css`
**Юу хийх**:
- [ ] Base colors (background, card, muted, border) → warm stone tone болгох
- [ ] Primary color → warm indigo `oklch(0.38 0.14 280)`
- [ ] Dark mode colors → deep warm dark `oklch(0.13 0.015 260)`
- [ ] Action colors (stress, joy, etc.) → saturation нэмэх (SKILL.md-с авна)
- [ ] `--radius` → `0.75rem` болгох (одоогийн `0.625rem`-с арай дугуй)

**Анхаар**: `globals.css`-д байгаа `:root { --background: oklch(1 0 0) }` -г SKILL.md-н warm palette-ээр солих.

---

## 🧩 PHASE 2 — Component Redesign

### TASK 2.1 — QuickActionButton
**Файл**: `features/journal/components/QuickActionButton.tsx`
**Юу хийх**:
- [ ] `default` variant-г vertical grid → **horizontal list** болгох
- [ ] Icon left (48×48 container), label+sub right, arrow far right
- [ ] Left border accent: `border-l-4` тухайн action color-оор
- [ ] Hover: `hover:shadow-sm hover:translate-x-0.5 hover:border-[action-color]`
- [ ] `compact` variant-г хадгалж болно (хэрэглэгдэж байвал)
- [ ] Disabled/lock logic огт өөрчлөхгүй — зөвхөн layout

**Шинэ layout sketch**:
```
┌─────────────────────────────────────────────────┐
│ ║ [🔥]  Стресс         Санаа зовж байна уу?  → │
└─────────────────────────────────────────────────┘
  ↑ 4px colored border-left
```

---

### TASK 2.2 — StepIndicator
**Файл**: `features/journal/components/StepIndicator.tsx`
**Юу хийх**:
- [ ] Одоогийн circle dots → **thin segmented progress bar** болгох
- [ ] 3 segment, active = primary color, inactive = muted
- [ ] Доор нь current step label: `"1 / 3 — Гадаргуу"` гэх мэт
- [ ] `current` prop-г ашиглана (шинэ prop нэмэхгүй)

---

### TASK 2.3 — ThoughtFlow Layout
**Файл**: `features/journal/components/ThoughtFlow.tsx`
**Юу хийх**:
- [ ] Wrapper-г `min-h-[calc(100dvh-160px)] flex flex-col` болгох
- [ ] StepIndicator дээр, textarea дунд, navigation доод хэсэгт (`mt-auto`)
- [ ] `max-w-md` → `max-w-lg` болгох (арай өргөн)
- [ ] `space-y-4` → `space-y-3` (spacing тighter)
- [ ] Navigation buttons: back ghost, next solid — одоогийнх хангалттай сайн

---

### TASK 2.4 — SurfaceStep / InnerReactionStep / MeaningStep
**Файл**: `features/journal/components/steps/*.tsx`
**Юу хийх**:
- [ ] Question text: `text-xl font-semibold leading-snug` — том, дулаан
- [ ] Textarea: `border-0 bg-transparent resize-none focus:ring-0 text-base` — цэвэр, borderless
- [ ] Textarea wrapper: `border border-border rounded-2xl p-4 bg-card focus-within:border-primary/50 transition-colors`
- [ ] Placeholder: italic, мuted

---

### TASK 2.5 — SeedInsightStep
**Файл**: `features/journal/components/SeedInsightStep.tsx`
**Юу хийх**:
- [ ] Гурван тусдаа card → **нэг unified card**, section divider (`<hr>`) -ээр тусгаарлах
- [ ] `mirror` section: `"Та ингэж харлаа"` label (xs uppercase muted) + italic body text
- [ ] `reframe` section: `"Өөр өнцгөөс"` label + normal body text
- [ ] `relief` section: `"Одоо хийж болох зүйл"` label + pill/badge style text (primary bg)
- [ ] Loading state: skeleton 3 lines, gentle pulse
- [ ] Analyzing message: centered, Sparkles icon animate

---

### TASK 2.6 — EntryCard
**Файл**: `features/journal/components/EntryCard.tsx`
**Юу хийх**:
- [ ] Date: `text-xs text-muted-foreground` top-right
- [ ] Surface text preview: `text-sm font-medium` truncate 2 lines
- [ ] Action type badge: colored pill bottom-left (action color)
- [ ] Hover: subtle shadow + border color change
- [ ] Нягт байрлал — card height ~80-90px max

---

## 🏠 PHASE 3 — Page-Level Polish

### TASK 3.1 — HomePage
**Файл**: `shared/components/HomePage.tsx`
**Юу хийх**:
- [ ] `space-y-6` → `space-y-3` (бүх section хоорондын зай)
- [ ] StatRow: 3 stat → нэг мөрт pill row (entry count · pattern · hawkins)
- [ ] HawkinsCard: gradient left accent (action color → transparent), level number `text-3xl font-bold`
- [ ] `HumanInsightSummary` card: цэвэр, quote-style, нэг мөрт
- [ ] "Тэмдэглэл нэмэх" CTA button: full-width, primary, icon left

---

### TASK 3.2 — DashboardLayout / Navigation
**Файл**: `shared/components/DashboardLayout.tsx`, `MobileBottomNav.tsx`
**Юу хийх**:
- [ ] Mobile bottom nav: `bg-card/80 backdrop-blur border-t` — frosted glass effect
- [ ] Active nav item: filled icon + primary color, inactive: outline + muted
- [ ] Layout padding: `px-4 py-3` max (одоо хэт их)

---

## 🔘 PHASE 4 — Shared UI Polish

### TASK 4.1 — Button Component
**Файл**: `shared/ui/button.tsx`
**Юу хийх**:
- [ ] `default` variant: primary color, `rounded-xl`, `font-semibold`
- [ ] `outline` variant: `border-border hover:border-primary/50`
- [ ] `ghost` variant: `hover:bg-muted/60`
- [ ] Size `sm`: `h-8 px-3 text-xs`
- [ ] Size `default`: `h-10 px-4 text-sm`

---

### TASK 4.2 — Card Component
**Файл**: `shared/ui/card.tsx`
**Юу хийх**:
- [ ] `--card-padding` → `1rem` (16px, одоо тодорхойгүй)
- [ ] Default border: `1px solid var(--border)`
- [ ] Hover-able card: `.hover-card` class нэмж болно

---

## ✅ Хийж дууссаны дараа шалгах зүйлс

- [ ] Light mode харагдал: дулаан, нягт, тодорхой hierarchy
- [ ] Dark mode харагдал: гүн, comfortable, action colors тод
- [ ] Mobile (375px): action buttons бүрэн харагдана уу
- [ ] ThoughtFlow: textarea focus хийхэд keyboard-г дарахгүй юу
- [ ] Transition/animation: хэт идэвхтэй биш, тайван
- [ ] TypeScript error гарахгүй (logic өөрчлөхгүй учир гарах ёсгүй)

---

## Хөдлөхгүй зүйлс (Touch хийхгүй)

- ❌ Hook logic (`useThoughtFlow`, `useEntries`, `useRateLimit`)
- ❌ API layer (`core/api/`)
- ❌ Auth logic (`core/auth/`)
- ❌ Props interface (prop нэмж, хасаж болохгүй)
- ❌ Routing (`app/` directory structure)
- ❌ Mongolian text content (UI copy өөрчлөхгүй)