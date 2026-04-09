# ════════════════════════════════════════════════════════════════════════════════
# MINDSTEPS NEXT.JS ARCHITECTURE REFACTORING PLAN
# Production-Ready SaaS Architecture for Scale
# ════════════════════════════════════════════════════════════════════════════════

## 1. PROPOSED IMPROVED PROJECT FOLDER STRUCTURE

```
app/
├── (marketing)/           # Route group: public landing pages
│   ├── page.tsx          # → imports from features/marketing
│   ├── demo/page.tsx
│   ├── upgrade/page.tsx
│   ├── join/page.tsx
│   └── _components/      # Marketing-specific components (stays here)
│
├── (auth)/               # Route group: authentication flows
│   ├── login/page.tsx    # → imports from features/auth
│   ├── join/page.tsx
│   └── auth/callback/route.ts
│
├── (dashboard)/          # Route group: authenticated dashboard
│   ├── layout.tsx        # Auth guard + DashboardLayout
│   ├── home/page.tsx     # → imports from features/journal
│   ├── entries/page.tsx  # → imports from features/entries
│   ├── entries/[entry_id]/page.tsx
│   ├── emotions/page.tsx # → imports from features/emotions
│   ├── insights/page.tsx # → imports from features/insights
│   └── graph/page.tsx    # → imports from features/graph
│
├── (admin)/              # Route group: admin panel
│   ├── layout.tsx
│   └── admin/page.tsx
│
├── (legal)/              # Route group: legal pages
│   ├── privacy/page.tsx
│   └── terms/page.tsx
│
├── api/                  # API routes (keep minimal, delegate to services)
│   ├── qpay/invoice/route.ts
│   └── qpay/check/route.ts
│
├── layout.tsx            # Root layout with providers
├── globals.css           # Design tokens only
└── manifest.ts

features/                 # FEATURE-BASED ARCHITECTURE
├── journal/              # Core journaling flow feature
│   ├── components/
│   │   ├── ActionGrid.tsx
│   │   ├── ThoughtFlow.tsx
│   │   ├── SurfaceStep.tsx
│   │   ├── InnerReactionStep.tsx
│   │   ├── MeaningStep.tsx
│   │   ├── SeedInsightStep.tsx
│   │   └── index.ts      # Public API
│   ├── views/
│   │   └── JournalView.tsx
│   ├── hooks/
│   │   └── useJournalFlow.ts
│   ├── services/
│   │   └── journal-flow.service.ts
│   ├── types.ts
│   └── index.ts          # Feature public API
│
├── entries/              # Journal entries list feature
│   ├── components/
│   │   ├── EntriesList.tsx
│   │   ├── EntryCard.tsx
│   │   ├── EntriesSearch.tsx
│   │   ├── EntriesPagination.tsx
│   │   └── EntriesSkeleton.tsx
│   ├── views/
│   │   └── EntriesView.tsx
│   ├── hooks/
│   │   └── useEntries.ts
│   ├── services/
│   │   └── entries.service.ts
│   ├── types.ts
│   └── index.ts
│
├── emotions/             # Emotion statistics feature
│   ├── components/
│   │   ├── EmotionBar.tsx
│   │   ├── EmotionStatsList.tsx
│   │   └── EmotionsSkeleton.tsx
│   ├── views/
│   │   └── EmotionsView.tsx
│   ├── hooks/
│   │   └── useEmotionStats.ts
│   ├── services/
│   │   └── emotions.service.ts
│   ├── types.ts
│   └── index.ts
│
├── insights/             # Deep insights feature
│   ├── components/
│   │   ├── InsightCard.tsx
│   │   ├── InsightsList.tsx
│   │   ├── InsightsUpgradeCTA.tsx
│   │   └── InsightsSkeleton.tsx
│   ├── views/
│   │   └── InsightsView.tsx
│   ├── hooks/
│   │   └── useInsights.ts
│   ├── services/
│   │   └── insights.service.ts
│   ├── types.ts
│   └── index.ts
│
├── auth/                 # Authentication feature
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── JoinForm.tsx
│   │   └── AuthSkeleton.tsx
│   ├── views/
│   │   ├── LoginView.tsx
│   │   └── JoinView.tsx
│   ├── hooks/
│   │   └── useAuthForm.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── types.ts
│   └── index.ts
│
└── marketing/            # Marketing/landing feature
    ├── components/
    │   ├── HeroSection.tsx
    │   ├── ProblemSection.tsx
    │   ├── HowItWorksSection.tsx
    │   ├── FeaturesSection.tsx
    │   └── WhoSection.tsx
    ├── views/
    │   └── LandingView.tsx
    ├── hooks/
    │   └── useLanding.ts
    ├── services/
    │   └── marketing.service.ts
    ├── types.ts
    └── index.ts

components/               # SHARED UI COMPONENTS
├── ui/                   # shadcn/ui primitives ONLY
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── dialog.tsx
│   ├── tabs.tsx
│   ├── progress.tsx
│   ├── label.tsx
│   ├── checkbox.tsx
│   ├── dropdown-menu.tsx
│   ├── alert.tsx
│   └── index.ts          # Barrel export
│
├── layout/               # Layout components (cross-feature)
│   ├── MainHeader.tsx
│   ├── DashboardLayout.tsx
│   ├── MobileNav.tsx
│   ├── Sidebar.tsx
│   └── index.ts
│
└── common/               # Shared domain-agnostic components
    ├── PageHeader.tsx
    ├── EmptyState.tsx
    ├── ErrorState.tsx
    ├── LoadingSpinner.tsx
    ├── TierPill.tsx
    ├── ThemeToggle.tsx
    ├── ActionBadge.tsx
    └── index.ts

providers/                # GLOBAL PROVIDERS
├── AuthProvider.tsx      # ← moved from contexts/
├── ThemeProvider.tsx     # ← moved from contexts/
├── TierProvider.tsx      # ← moved from contexts/
├── ToastProvider.tsx     # ← moved from contexts/
└── index.ts

lib/                      # INFRASTRUCTURE LAYER
├── supabase/
│   ├── client.ts
│   ├── server.ts
│   └── middleware.ts
│
├── services/             # Domain services (API calls)
│   ├── journal.service.ts
│   ├── analysis.service.ts
│   ├── payments.service.ts
│   └── index.ts
│
├── utils/
│   ├── date.ts
│   ├── format.ts
│   └── validation.ts
│
└── permissions.ts        # Authorization logic

data/                     # STATIC DATA
├── constants.ts
└── emotions.ts

styles/                   # DESIGN SYSTEM
├── design-tokens.css     # ← extracted from globals.css
├── animations.css        # ← extracted from globals.css
└── index.css             # Main import

types/                    # TYPE DEFINITIONS
└── index.ts              # All domain types

contexts/                 # DEPRECATED - will be removed
                          # Contents moved to providers/
```

## 2. FILES TO BE MOVED

### FROM `contexts/` TO `providers/`:
- contexts/AuthContext.tsx     → providers/AuthProvider.tsx
- contexts/TierContext.tsx     → providers/TierProvider.tsx
- contexts/ToastContext.tsx    → providers/ToastProvider.tsx
- contexts/theme-provider.tsx  → providers/ThemeProvider.tsx

### FROM `components/organisms/` TO `features/`:
- components/organisms/ActionGrid.tsx         → features/journal/components/ActionGrid.tsx
- components/organisms/ThoughtFlow.tsx        → features/journal/components/ThoughtFlow.tsx
- components/organisms/SurfaceStep.tsx        → features/journal/components/SurfaceStep.tsx
- components/organisms/InnerReactionStep.tsx  → features/journal/components/InnerReactionStep.tsx
- components/organisms/MeaningStep.tsx        → features/journal/components/MeaningStep.tsx
- components/organisms/SeedInsightStep.tsx    → features/journal/components/SeedInsightStep.tsx

### FROM `components/molecules/` TO `features/` OR `components/common/`:
- components/molecules/InsightCard.tsx  → features/insights/components/InsightCard.tsx
- components/molecules/JournalTextarea.tsx → features/journal/components/JournalTextarea.tsx
- components/molecules/StepIndicator.tsx → features/journal/components/StepIndicator.tsx
- components/molecules/QuickActionButton.tsx → features/journal/components/QuickActionButton.tsx
- components/molecules/NavigationControls.tsx → features/journal/components/NavigationControls.tsx
- components/molecules/OptionButton.tsx → components/common/OptionButton.tsx
- components/molecules/ActionCard.tsx → components/common/ActionCard.tsx

### FROM `components/atoms/` TO `components/common/`:
- components/atoms/PageHeader.tsx → components/common/PageHeader.tsx
- components/atoms/ActionBadge.tsx → components/common/ActionBadge.tsx
- components/atoms/TierPill.tsx → components/common/TierPill.tsx
- components/atoms/ProgressBar.tsx → components/common/ProgressBar.tsx
- components/atoms/ThemeToggle.tsx → components/common/ThemeToggle.tsx

### FROM `components/templates/` TO `components/layout/` AND `features/`:
- components/templates/DashboardLayout.tsx → components/layout/DashboardLayout.tsx
- components/templates/HomePageTemplate.tsx → features/journal/views/JournalView.tsx

### FROM `lib/services/` TO `features/*/services/`:
- lib/services/journal.service.ts → Split into:
  - features/entries/services/entries.service.ts
  - features/insights/services/insights.service.ts
  - features/emotions/services/emotions.service.ts

## 3. EXAMPLE OF A FULLY REFACTORED FEATURE MODULE

See: /workspace/features/emotions/ (created in this refactoring)

## 4. EXAMPLE REFACTORED PAGE.TSX

See: /workspace/app/(dashboard)/emotions/page.tsx (refactored in this plan)

## 5. DESIGN SYSTEM USAGE

All components must use semantic design tokens from globals.css:

### CORRECT:
```tsx
<div className="bg-background text-foreground">
  <Card className="bg-surface border-border">
    <p className="text-muted-foreground">
    <Button variant="primary" className="bg-primary text-primary-foreground">
    <div className="bg-surface-2"> {/* nested panel */}
```

### INCORRECT:
```tsx
<div className="bg-white text-gray-900">
  <Card className="bg-zinc-50 border-gray-200">
    <p className="text-gray-500">
    <Button className="bg-orange-600 text-white">
    <div className="bg-gray-100">
```

## 6. ARCHITECTURAL EXPLANATION

### KEY PRINCIPLES:

1. **Feature-Based Architecture**
   - Each feature is self-contained with its own components, views, hooks, services, and types
   - Features expose a clean public API through index.ts
   - Cross-feature communication happens through shared contexts and services

2. **Separation of Concerns**
   - `app/` = Routing only (thin page files)
   - `features/` = Domain logic and UI
   - `components/` = Shared UI primitives
   - `lib/` = Infrastructure (API clients, utilities)
   - `providers/` = Global state providers

3. **Next.js App Router Best Practices**
   - Page files are minimal, importing views from features
   - Server Components by default, 'use client' only when needed
   - Suspense boundaries for loading states
   - Route groups for layout organization

4. **Design System Consistency**
   - All colors use semantic tokens (bg-background, text-foreground)
   - No hardcoded colors in components
   - Surface hierarchy: background → surface → surface-2

5. **Scalability for SaaS**
   - New features can be added as independent modules
   - AI modules can be added as new features (features/ai-analysis/)
   - Payment/tier logic isolated in providers and services

### IMPORT RULES:

✅ CORRECT:
```ts
import { EmotionsView } from '@/features/emotions'
import { Button } from '@/components/ui'
import { useAuth } from '@/providers/AuthProvider'
```

❌ INCORRECT:
```ts
import { EmotionsView } from '../../../features/emotions/views/EmotionsView'
import { Button } from '../../ui/button'
```

### BENEFITS:

1. **Maintainability**: Clear ownership of code
2. **Testability**: Isolated feature modules
3. **Scalability**: Easy to add new features
4. **Onboarding**: Predictable structure
5. **Performance**: Better code splitting potential
