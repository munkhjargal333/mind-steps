# 🏗️ Feature-Driven Architecture Refactoring Plan

## Current Problems

1. **Mixed architectures**: Atomic design (atoms/molecules/organisms) coexists with feature-based folders
2. **Duplication**: Components exist in both `/components/atoms` and `/components/common`
3. **Scattered logic**: Services in `/lib/services`, hooks in `/lib/hooks`, contexts in `/contexts` and `/providers`
4. **Poor scalability**: Hard to onboard new developers, unclear ownership

## Target Architecture: Clean Feature-Driven

### Core Principles

1. **Feature-first**: All code related to a feature lives together
2. **Colocation**: Components, hooks, services, types, and tests for a feature are in one folder
3. **Shared UI**: Generic, domain-agnostic components go to `/shared/ui`
4. **Minimal global state**: Keep only essential providers (Auth, Theme), move business logic to Zustand stores
5. **Clear boundaries**: Features don't import from other features directly

---

## New Folder Structure

```
/workspace
├── app/                          # Next.js App Router - thin routing layer
│   ├── (auth)/                   # Auth route group
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── entries/
│   │   ├── emotions/
│   │   ├── graph/
│   │   ├── home/
│   │   └── insights/
│   ├── (marketing)/              # Marketing pages
│   ├── api/                      # API routes (BFF pattern)
│   ├── layout.tsx                # Root layout with minimal providers
│   └── globals.css
│
├── features/                     # FEATURE MODULES (core business logic)
│   ├── journal/                  # Journaling flow feature
│   │   ├── components/           # Feature-specific components
│   │   │   ├── JournalFlow.tsx
│   │   │   ├── SurfaceStep.tsx
│   │   │   ├── InnerReactionStep.tsx
│   │   │   ├── MeaningStep.tsx
│   │   │   ├── SeedInsightStep.tsx
│   │   │   └── index.ts
│   │   ├── hooks/                # Feature-specific hooks
│   │   │   ├── useJournalFlow.ts
│   │   │   └── index.ts
│   │   ├── services/             # Feature-specific API calls
│   │   │   ├── journal.api.ts
│   │   │   └── index.ts
│   │   ├── types.ts              # Feature-specific types
│   │   ├── constants.ts          # Feature-specific constants
│   │   └── index.ts              # Public barrel export
│   │
│   ├── entries/                  # Entries list/detail feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── emotions/                 # Emotions stats feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── insights/                 # Deep insights feature
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types.ts
│       └── index.ts
│
├── shared/                       # SHARED CODE (cross-feature)
│   ├── ui/                       # Generic UI components (domain-agnostic)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   ├── Dialog.tsx
│   │   ├── Tabs.tsx
│   │   ├── DropdownMenu.tsx
│   │   ├── Progress.tsx
│   │   ├── Label.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Alert.tsx
│   │   └── index.ts
│   │
│   ├── layout/                   # Shared layout components
│   │   ├── MainHeader.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── index.ts
│   │
│   └── lib/                      # Shared utilities
│       ├── utils.ts
│       ├── date.ts
│       └── api-client.ts         # Generic fetch wrapper
│
├── core/                         # CORE APPLICATION LAYER
│   ├── auth/                     # Authentication
│   │   ├── AuthProvider.tsx
│   │   ├── useAuth.ts
│   │   └── auth.service.ts
│   │
│   ├── tier/                     # Subscription tier
│   │   ├── TierProvider.tsx
│   │   ├── useTier.ts
│   │   └── tier.service.ts
│   │
│   └── toast/                    # Toast notifications
│       ├── ToastProvider.tsx
│       ├── useToast.ts
│       └── index.ts
│
├── styles/                       # Global styles
│   ├── globals.css
│   ├── design-tokens.css
│   └── animations.css
│
├── types/                        # GLOBAL TYPES
│   └── index.ts
│
├── data/                         # STATIC DATA
│   ├── constants.ts
│   └── emotions.ts
│
├── middleware.ts                 # Next.js middleware
├── next.config.ts
└── tailwind.config.ts
```

---

## Key Architectural Decisions

### 1. Remove Atomic Design Completely

**Why**: Atomic design creates artificial abstractions that don't match user mental models. A "SurfaceStep" is not an "organism" — it's a **journal component**.

**Action**: 
- Delete `/components/atoms`, `/components/molecules`, `/components/organisms`, `/components/templates`
- Move reusable UI to `/shared/ui`
- Move feature-specific components into their feature folders

### 2. Feature Module Structure

Each feature is a **self-contained module** with:

```
features/journal/
├── components/      # UI components ONLY used by this feature
├── hooks/           # React hooks with business logic
├── services/        # API calls (pure functions, no React)
├── types.ts         # TypeScript types specific to this feature
├── constants.ts     # Feature-specific constants
└── index.ts         # Public API (barrel exports)
```

**Rules**:
- Features NEVER import from other features
- Features import from `/shared` and `/core`
- External code imports from `features/journal` (not internal paths)

### 3. Shared UI Layer

`/shared/ui` contains **dumb, domain-agnostic components**:

- Button, Input, Textarea, Card, Dialog, etc.
- No business logic
- No feature-specific styling
- Configured via props only

### 4. Core Application Layer

`/core` contains **cross-cutting concerns**:

- Auth (session management)
- Tier (subscription state)
- Toast (notifications)
- Theme (already handled by next-themes)

**State Management Strategy**:
- Keep Auth/Tier as Context Providers (necessary for tree-wide state)
- Use Zustand for complex client state (optional, add if needed)
- Server state via React Query or simple fetch in hooks

### 5. API Layer Pattern

Move API logic from `/lib/services` into feature services:

```typescript
// features/journal/services/journal.api.ts
import { apiClient } from '@/shared/lib/api-client';
import type { JournalEntry, SeedInsight } from '@/types';

export async function createEntry(payload: {...}): Promise<{ entryId: string; insight: SeedInsight }> {
  return apiClient.post('/entries', payload);
}
```

---

## Migration Steps

### Phase 1: Setup Foundation (Day 1)

1. Create new directory structure
2. Set up `/shared/ui` with all base components
3. Create `/shared/lib/api-client.ts` (generic fetch wrapper)
4. Move `/components/ui/*` → `/shared/ui/*`

### Phase 2: Migrate Features (Day 2-3)

**Journal Feature**:
1. Create `features/journal/` structure
2. Move `ThoughtFlow.tsx` + step components → `features/journal/components/`
3. Move `useJournalFlow.ts` → `features/journal/hooks/`
4. Extract API calls from `lib/services/journal.service.ts` → `features/journal/services/journal.api.ts`
5. Update imports in all files

**Entries Feature**:
1. Create `features/entries/` structure
2. Move entries-related components/hooks
3. Create entries API service

**Emotions Feature**:
1. Already partially structured — complete the migration
2. Move service from `features/emotions/services/` to proper structure

**Insights Feature**:
1. Create `features/insights/` structure
2. Move hooks and create components

### Phase 3: Cleanup Old Structure (Day 4)

1. Delete `/components/atoms`, `/components/molecules`, `/components/organisms`, `/components/templates`
2. Remove duplicate components from `/components/common`
3. Delete `/lib/services/*` (moved to features)
4. Delete `/lib/hooks/*` (moved to features or shared)

### Phase 4: Consolidate Providers (Day 5)

1. Keep `/core/auth/`, `/core/tier/`, `/core/toast/`
2. Simplify provider nesting in `app/layout.tsx`
3. Consider Zustand for complex state (if needed)

### Phase 5: Testing & Validation

1. Run TypeScript compilation
2. Run ESLint
3. Test all user flows
4. Verify bundle size

---

## Example: Refactored Journal Feature

### Before (scattered):
```
/components/organisms/ThoughtFlow.tsx
/components/organisms/SurfaceStep.tsx
/components/molecules/JournalTextarea.tsx
/features/journal/hooks/useJournalFlow.ts
/lib/services/journal.service.ts
```

### After (colocated):
```
/features/journal/
├── components/
│   ├── JournalFlow.tsx
│   ├── SurfaceStep.tsx
│   ├── InnerReactionStep.tsx
│   ├── MeaningStep.tsx
│   ├── SeedInsightStep.tsx
│   └── index.ts
├── hooks/
│   ├── useJournalFlow.ts
│   └── index.ts
├── services/
│   ├── journal.api.ts
│   └── index.ts
├── types.ts
└── index.ts
```

### Usage:
```typescript
// app/(dashboard)/home/page.tsx
import { JournalFlow } from '@/features/journal';
import type { QuickActionType } from '@/types';

export default function HomePage() {
  const handleComplete = () => router.push('/entries');
  
  return (
    <JournalFlow 
      initialAction="stress" 
      onComplete={handleComplete}
    />
  );
}
```

---

## Scalability Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **Onboarding** | Confusing, multiple patterns | Clear feature ownership |
| **Code Location** | Scattered across 5+ directories | All in one feature folder |
| **Testing** | Hard to isolate features | Test each feature independently |
| **Team Scaling** | Merge conflicts on shared folders | Each team owns features |
| **Performance** | Large bundles | Code-split by feature |
| **Maintenance** | Fear of breaking changes | Isolated changes |

---

## Next Steps

1. Review and approve this plan
2. Execute Phase 1 (setup foundation)
3. Proceed feature by feature
4. Validate after each phase
