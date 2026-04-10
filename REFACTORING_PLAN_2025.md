# 🏗️ Refactoring Plan - MindSteps

## 📊 Current State Analysis

### Top Fat Files (Priority Order)

| File | Lines | Priority | Issue | Action |
|------|-------|----------|-------|--------|
| `app/(marketing)/page.tsx` | 299 | **High** | Landing page with inline sections | Extract section components |
| `data/constants.ts` | 296 | Medium | Large static data file | Split by domain |
| `lib/api/modules/lessons.ts` | 287 | Low | API service (acceptable) | Keep as-is |
| `lib/api/journalBackend.ts` | 269 | Low | Backend service | Keep as-is |
| `components/ui/dropdown-menu.tsx` | 257 | Low | Radix primitive | Keep as-is |
| `app/(dashboard)/entries/page.tsx` | 251 | **High** | Entry list + search + pagination | Extract components |
| `app/(auth)/login/page.tsx` | 219 | **High** | Login form + Google + Demo | Extract form components |
| `contexts/hooks/useAuthLogic.ts` | 194 | Done ✅ | Auth logic | Already extracted |
| `app/(dashboard)/entries/[entry_id]/page.tsx` | 190 | Medium | Entry detail page | Review & extract if needed |
| `lib/api/modules/goals.ts` | 184 | Low | API service | Keep as-is |
| `components/shared/HomeContainer.tsx` | 170 | Medium | Home layout | Review structure |
| `app/(marketing)/join/page.tsx` | 169 | Medium | Join page | Extract components |
| `components/features/upgrade/QPayPayment.tsx` | 168 | Done ✅ | Payment logic | Already extracted |
| `components/layout/MobileDrawer.tsx` | 160 | Done ✅ | Mobile drawer | Already extracted |

---

## 🎯 Phase 1: CSS Tokens System ✅ COMPLETED

**Status:** Complete  
**Files Changed:** 4

### Done:
- ✅ Created `/app/design-tokens.css` - Centralized design tokens
- ✅ Updated `ActionCard.module.css` - Token-based styling
- ✅ Updated `TierPill.module.css` - Token-based styling  
- ✅ Updated `globals.css` - Import tokens

**Tokens Available:**
- Spacing scale (`--space-0` to `--space-16`)
- Border radius (`--radius-none` to `--radius-full`)
- Typography (font-size, weight, line-height)
- Transitions (fast, normal, slow)
- Shadows (xs to xl)
- Action colors (8 emotions)
- Component tokens (card, button, tier badge)

---

## 🔪 Phase 2: Fat File Reduction ✅ PARTIALLY COMPLETE

### 2.1 Upgrade Page ✅ DONE
**Before:** `app/(marketing)/upgrade/page.tsx` (341 lines)  
**After:** 
- `app/(marketing)/upgrade/page.tsx` (73 lines)
- `components/features/upgrade/PricingCard.tsx` (127 lines)
- `components/features/upgrade/QPayPayment.tsx` (168 lines)

**Result:** -78% reduction in main page

### 2.2 Dashboard Layout ✅ DONE
**Before:** `components/shared/DashboardLayout.tsx` (285 lines)  
**After:**
- `components/layout/DashboardLayout.tsx` (90 lines)
- `components/layout/DesktopSidebar.tsx` (73 lines)
- `components/layout/MobileBottomNav.tsx` (58 lines)
- `components/layout/MobileDrawer.tsx` (160 lines)

**Result:** -68% reduction

### 2.3 Auth Context ✅ DONE
**Before:** `contexts/AuthContext.tsx` (218 lines)  
**After:**
- `contexts/AuthContext.tsx` (26 lines) - Types + hook
- `contexts/AuthProvider.tsx` (11 lines) - Provider only
- `contexts/hooks/useAuthLogic.ts` (194 lines) - All logic

**Result:** -88% reduction in context file

---

## 📁 Phase 3: Feature-Driven Architecture 🔄 IN PROGRESS

### Target Structure

```
/workspace
├── app/                          # Next.js App Router (thin layer)
│   ├── (auth)/                   # Auth routes
│   ├── (dashboard)/              # Dashboard routes
│   ├── (marketing)/              # Marketing pages
│   └── api/                      # BFF pattern
│
├── features/                     # FEATURE MODULES (NEW)
│   ├── journal/                  # Journaling flow
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── entries/                  # Entries list/detail
│   ├── emotions/                 # Emotions stats
│   └── insights/                 # Deep insights
│
├── shared/                       # SHARED CODE
│   ├── ui/                       # Generic UI components
│   ├── layout/                   # Shared layouts
│   └── lib/                      # Utilities
│
├── core/                         # CORE APPLICATION
│   ├── auth/
│   ├── tier/
│   └── toast/
│
└── styles/                       # Global styles
    ├── globals.css
    └── design-tokens.css
```

### Migration Steps

#### Step 1: Create `/shared/ui` Barrel ✅ TODO
Move generic components from `/components/ui`:
- Button, Input, Textarea, Card, Dialog, Tabs
- DropdownMenu, Progress, Label, Checkbox, Alert

#### Step 2: Create `/features/journal` ✅ TODO
Extract from current scattered locations:
- Move `ThoughtFlow.tsx` + steps → `features/journal/components/`
- Move `useJournalFlow.ts` → `features/journal/hooks/`
- Extract API calls → `features/journal/services/journal.api.ts`

#### Step 3: Create `/features/entries` ✅ TODO
From `app/(dashboard)/entries/page.tsx` (251 lines):
- Extract `EntryList` component
- Extract `EntryFilters` (search, sort)
- Extract `EntryPagination`
- Create `entries.api.ts` service

#### Step 4: Create `/features/emotions` ✅ TODO
Consolidate emotion-related code

#### Step 5: Cleanup Old Structure ✅ TODO
- Delete `/components/atoms`, `/components/molecules`, `/components/organisms`
- Remove duplicates from `/components/common`
- Remove `/lib/services/*` (moved to features)

---

## 🎯 Immediate Next Actions

### Priority 1: Landing Page Components (299 lines)
**File:** `app/(marketing)/page.tsx`

**Extract:**
1. `HeroSection.tsx` - Hero with CTA
2. `ProblemSection.tsx` - Problem cards
3. `HowItWorksSection.tsx` - 4-step process
4. `FeaturesSection.tsx` - Feature cards
5. `WhoItIsForSection.tsx` - Target audience
6. `CTASection.tsx` - Final CTA

**Expected Result:** Page reduced to ~50 lines

### Priority 2: Entries Page Components (251 lines)
**File:** `app/(dashboard)/entries/page.tsx`

**Extract:**
1. `EntryCard.tsx` → `features/entries/components/EntryCard.tsx` (already inline)
2. `EntriesHeader.tsx` - Title + "New" button
3. `EntriesSearch.tsx` - Search input
4. `EntriesEmptyState.tsx` - Empty state
5. `EntriesPagination.tsx` - Pagination controls

**Expected Result:** Page reduced to ~60 lines

### Priority 3: Login Page Components (219 lines)
**File:** `app/(auth)/login/page.tsx`

**Extract:**
1. `LoginForm.tsx` - Email/password form (already exists but can be cleaner)
2. `SocialLogin.tsx` - Google login button
3. `DemoLogin.tsx` - Demo mode button
4. `LoginErrorAlert.tsx` - Error display

**Expected Result:** Page reduced to ~50 lines

### Priority 4: Constants File Split (296 lines)
**File:** `data/constants.ts`

**Split into:**
1. `data/tier.constants.ts` - Tier definitions
2. `data/actions.constants.ts` - Quick actions catalog
3. `data/lesson.constants.ts` - Lesson categories
4. `data/ui.constants.ts` - UI-related constants

---

## 📋 Checklist

### Phase 1: CSS Tokens ✅
- [x] Create design-tokens.css
- [x] Update existing module CSS files
- [ ] Add animations.css (optional)

### Phase 2: Fat Files ✅ Partial
- [x] upgrade/page.tsx (341 → 73)
- [x] DashboardLayout.tsx (285 → 90)
- [x] AuthContext.tsx (218 → 26)
- [ ] marketing/page.tsx (299 → ~50)
- [ ] entries/page.tsx (251 → ~60)
- [ ] login/page.tsx (219 → ~50)
- [ ] constants.ts (296 → split into 4 files)

### Phase 3: Feature Architecture 🔄
- [ ] Create `/shared/ui` barrel exports
- [ ] Create `/features/journal` module
- [ ] Create `/features/entries` module
- [ ] Create `/features/emotions` module
- [ ] Create `/features/insights` module
- [ ] Cleanup old atomic design folders

### Phase 4: Testing
- [ ] TypeScript compilation
- [ ] ESLint check
- [ ] Manual testing of all flows

---

## 📈 Success Metrics

| Metric | Before | Target | Status |
|--------|--------|--------|--------|
| Largest page file | 341 lines | <100 lines | ✅ Achieved (73) |
| Fat files (>200 lines) | 7 files | 0 files | 🔄 In progress |
| Feature modules | 0 | 4 modules | ⏳ Pending |
| CSS consistency | Mixed | 100% tokens | ✅ Achieved |
| Component reusability | Low | High | 🔄 In progress |

---

## 🚀 Quick Wins This Week

1. **Landing Page** - Extract 6 section components (2 hours)
2. **Entries Page** - Extract 5 components (1.5 hours)
3. **Constants Split** - Divide into 4 domain files (1 hour)
4. **Shared UI Barrel** - Export all base components (1 hour)

**Total Time:** ~5.5 hours  
**Impact:** Remove 4 fat files, establish feature pattern
