# mind-steps

Монгол хэл дээрх ментал эрүүл мэндийн өдрийн тэмдэглэл SaaS аппликэйшн. Хэрэглэгчид сэтгэл хөдлөлөө хянаж, бүтцийн дагуу тусгал хийж, AI-аар гүнзгий дүн шинжилгээ авах боломжтой.

## 🎯 Үндсэн функц

- **Journal Flow**: Guided тусгалын процесс (Surface → Inner Reaction → Meaning → Seed Insight)
- **Entries**: Өмнөх бичлэгүүдийг харах, удирдах
- **Emotions**: Сэтгэл хөдлөлийн статистикийг хянах
- **Insights**: AI-аар гүнзгий дүн шинжилгээ
- **Tier System**: Үнэгүй болон премиум гишүүнчлэл

## 🏗️ Архитектур

Энэ проект нь **Feature-Driven Architecture** ашигладаг:

```
/workspace
├── app/                    # Next.js App Router (нимгэн routing layer)
├── features/               # Feature модулиуд (journal, entries, emotions, insights)
├── shared/                 # Нийтлэг код (ui, layout, lib)
├── core/                   # Core application layer (auth, tier, toast)
├── styles/                 # Global стил ба design token-ууд
└── types/                  # Global төрөл тодорхойлолтууд
```

### Feature Module Бүтэц

Feature бүр нь өөрийн гэсэн бүрэн бүтэн модуль:

```
features/journal/
├── components/      # Зөвхөн энэ feature-д хамаарах UI компонентууд
├── hooks/           # Бизнес логиктой React hooks
├── services/        # API дуудлагууд (pure functions)
├── types.ts         # Тусгай төрөл тодорхойлолтууд
├── constants.ts     # Тусгай тогтмол утгууд
└── index.ts         # Public barrel export
```

### Design Token Систем

Feature бүр өөрийн дизайн токеныг тодорхойлж, shared token-уудтай нэгддэг:

```typescript
// features/journal/tokens.ts
export const journalTokens = {
  colors: {
    surface: 'var(--journal-surface)',
    accent: 'var(--journal-accent)',
  },
  spacing: {
    step: '1.5rem',
  },
} as const;
```

## 🚀 Эхлүүлэх

```bash
# Суулгах
yarn install

# Development server ажиллуулах
yarn dev

# Production build
yarn build
```

## 📁 Folder Structure Дэлгэрэнгүй

| Folder | Тайлбар |
|--------|---------|
| `app/` | Next.js маршрутууд - нимгэн layer, зөвхөн routing |
| `features/` | Бизнес логик бүхий feature модулиуд |
| `shared/` | Domain-agnostic компонентууд ба utility-ууд |
| `core/` | Cross-cutting concerns (Auth, Tier, Toast) |
| `styles/` | CSS ба design token тодорхойлолтууд |
| `types/` | TypeScript global төрлүүд |

## 🧩 Vibe Coding Principles

Энэ проект нь дараах зарчмуудыг баримталдаг:

1. **Feature-first**: Feature-тэй холбоотой бүх код нэг дор байрладаг
2. **Colocation**: Компонент, hook, service, type, test нь нэг folder-т
3. **Token-driven styling**: CSS variable-based design tokens ашигладаг
4. **Minimal global state**: Зөвхөн шаардлагатай provider-уудыг ашигладаг
5. **Clear boundaries**: Feature-ууд хоорондоо шууд импорт хийдэггүй

## 📖 Баримтжуулалт

- [Refactoring Plan](./REFACTORING_PLAN.md) - Feature-driven архитектураар шилжих дэлгэрэнгүй төлөвлөгөө

## 🎨 Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + semantic design tokens
- **UI Components**: shadcn/ui primitives
- **Backend**: Supabase (Auth, Database, Storage)
- **State Management**: React Context + Zustand
- **Payments**: QPay integration

## 🪙 Token-Based Feature System

Vibe coding ашиглан шинэ feature нэмэхэд дараах token системийг ашиглана:

### Token Төрлүүд

```typescript
// 1. Semantic Design Tokens (CSS Variables)
--color-primary, --color-surface, --spacing-md, --radius-lg

// 2. Feature Tokens (Feature тусгай)
--journal-accent, --emotions-gradient, --insights-glow

// 3. Component Tokens (Компонент тусгай)
--button-primary-bg, --card-shadow, --input-border
```

### Шинэ Feature Нэмэх Урсгал

```bash
# 1. Feature folder үүсгэх
mkdir -p features/{feature-name}/{components,hooks,services}

# 2. Token тодорхойлох
touch features/{feature-name}/tokens.ts

# 3. Component бичих
touch features/{feature-name}/components/{ComponentName}.tsx
```

### Token Ашиглах Жишээ

```typescript
// features/journal/tokens.ts
export const journalTokens = {
  colors: {
    surface: 'var(--journal-surface)',
    accent: 'var(--journal-accent)',
    text: 'var(--journal-text)',
  },
  spacing: {
    step: 'var(--spacing-step)',
    container: 'var(--container-max)',
  },
} as const;

// features/journal/components/JournalCard.tsx
import { journalTokens } from '../tokens';

export function JournalCard() {
  return (
    <div style={{ 
      backgroundColor: journalTokens.colors.surface,
      padding: journalTokens.spacing.step 
    }}>
      {/* content */}
    </div>
  );
}
```

## 🎯 Vibe Coding Guidelines

### ✅ Зөв

```typescript
// Feature өөрийн token-той
features/emotions/tokens.ts → emotionsTokens
features/journal/tokens.ts → journalTokens

// Shared token ашиглах
shared/ui/Button.tsx → uses global design tokens

// Import цэвэр
import { JournalFlow } from '@/features/journal';
import { Button } from '@/shared/ui';
```

### ❌ Буруу

```typescript
// Feature хоорондын шууд импорт
import { something } from '@/features/journal'; // inside features/emotions

// Hardcoded утгууд
style={{ backgroundColor: '#3b82f6' }} // → use token

// Atomic design хуучин хэв маяг
components/atoms/Button → shared/ui/Button
```

## 🔧 Token Extension Point

Шинэ токен нэмэхийн тулд:

1. `styles/design-tokens.css` файл дахь `:root` эсвэл `[data-theme]` дотор CSS variable тодорхойлно
2. Feature token бол `features/{name}/tokens.ts` файл дотор TypeScript object үүсгэнэ
3. Component дээр token object-оос утгыг авна

Энэ нь хурдан iteration, өнгөний схем солих, dark mode дэмжихэд тохиромжтой.
