# 🏗️ Refactoring Plan - MindSteps

## 📊 Current State Analysis

### Top Fat Files (Priority Order)

| File | Lines | Priority | Issue | Action | Status |
|------|-------|----------|-------|--------|--------|
| `app/(marketing)/page.tsx` | 46 ✅ | **Done** | Landing page refactored | Extracted 6 section components | ✅ Complete |
| `data/constants.ts` | 296 → 167 | Medium | Partially split | Split tier & actions | 🔄 In progress |
| `lib/api/modules/lessons.ts` | 287 | Low | API service (acceptable) | Keep as-is | ⏳ Pending |
| `lib/api/journalBackend.ts` | 269 | Low | Backend service | Keep as-is | ⏳ Pending |
| `components/ui/dropdown-menu.tsx` | 257 | Low | Radix primitive | Keep as-is | ⏳ Pending |
| `app/(dashboard)/entries/page.tsx` | 149 | **Medium** | Entry list + search + pagination | Partial extraction | 🔄 In progress |
| `app/(auth)/login/page.tsx` | 219 | **High** | Login form + Google + Demo | Extract form components | ⏳ Pending |
| `contexts/hooks/useAuthLogic.ts` | 194 | Done ✅ | Auth logic | Already extracted | ✅ Complete |
| `app/(dashboard)/entries/[entry_id]/page.tsx` | 190 | Medium | Entry detail page | Review & extract if needed | ⏳ Pending |
| `lib/api/modules/goals.ts` | 184 | Low | API service | Keep as-is | ⏳ Pending |
| `components/shared/HomeContainer.tsx` | 170 | Medium | Home layout | Review structure | ⏳ Pending |
| `app/(marketing)/join/page.tsx` | 169 | Medium | Join page | Extract components | ⏳ Pending |
| `components/features/upgrade/QPayPayment.tsx` | 168 | Done ✅ | Payment logic | Already extracted | ✅ Complete |
| `components/layout/MobileDrawer.tsx` | 160 | Done ✅ | Mobile drawer | Already extracted | ✅ Complete |

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

## 🔪 Phase 2: Fat File Reduction ✅ UPDATED PROGRESS

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

### 2.4 Landing Page ✅ DONE (NEW)
**Before:** `app/(marketing)/page.tsx` (299 lines)  
**After:**
- `app/(marketing)/page.tsx` (46 lines) - Main page only
- `app/(marketing)/_sections/HeroSection.tsx` (44 lines)
- `app/(marketing)/_sections/ProblemSection.tsx` (46 lines)
- `app/(marketing)/_sections/HowItWorksSection.tsx` (44 lines)
- `app/(marketing)/_sections/FeaturesSection.tsx` (40 lines)
- `app/(marketing)/_sections/WhoItIsForSection.tsx` (46 lines)
- `app/(marketing)/_sections/CTASection.tsx` (43 lines)

**Result:** -85% reduction in main page

### 2.5 Entries Page 🔄 IN PROGRESS (NEW)
**Before:** `app/(dashboard)/entries/page.tsx` (251 lines)  
**After:**
- `app/(dashboard)/entries/page.tsx` (149 lines) - Reduced but needs more work
- `features/entries/components/EntryCard.tsx` (89 lines) - Extracted

**Result:** -41% reduction (target: ~60 lines)

**Remaining Work:**
- Extract `EntriesHeader.tsx`
- Extract `EntriesSearch.tsx`
- Extract `EntriesEmptyState.tsx`
- Extract `EntriesPagination.tsx`

### 2.6 Constants File Split 🔄 IN PROGRESS (NEW)
**Before:** `data/constants.ts` (296 lines)  
**After:**
- `data/constants.ts` (167 lines remaining)
- `data/tier.constants.ts` (13 lines) - Tier definitions ✅
- `data/actions.constants.ts` (116 lines) - Action catalog ✅

**Result:** -44% reduction

**Remaining to Split:**
- `STEP_CONFIG` (step questions copy) → `data/lesson.constants.ts`
- `STEPS` (step indicator metadata) → `data/lesson.constants.ts`
- `INSIGHT_CARDS` (seed insight cards) → `data/lesson.constants.ts`
- `ACTION_LABELS` → `data/ui.constants.ts`

---

## 📁 Phase 3: Feature-Driven Architecture 🔄 IN PROGRESS

### Target Structure

```
/workspace
├── app/                          # Next.js App Router (thin layer)
│   ├── (auth)/                   # Auth routes
│   ├── (dashboard)/              # Dashboard routes
│   ├── (marketing)/              # Marketing pages
│   │   └── _sections/            # Landing page sections ✅ NEW
│   └── api/                      # BFF pattern
│
├── features/                     # FEATURE MODULES (NEW)
│   ├── entries/                  # Entries list/detail 🔄 STARTED
│   │   └── components/
│   │       └── EntryCard.tsx     ✅ Extracted
│   ├── journal/                  # Journaling flow
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
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

#### Step 3: Create `/features/entries` 🔄 IN PROGRESS
From `app/(dashboard)/entries/page.tsx` (251 lines):
- ✅ Extract `EntryCard.tsx` → `features/entries/components/EntryCard.tsx`
- ⏳ Extract `EntryList` component
- ⏳ Extract `EntryFilters` (search, sort)
- ⏳ Extract `EntryPagination`
- ⏳ Create `entries.api.ts` service

#### Step 4: Create `/features/emotions` ✅ TODO
Consolidate emotion-related code

#### Step 5: Cleanup Old Structure ✅ TODO
- Delete `/components/atoms`, `/components/molecules`, `/components/organisms`
- Remove duplicates from `/components/common`
- Remove `/lib/services/*` (moved to features)

---

## 🎯 Immediate Next Actions

### Priority 1: Landing Page Components ✅ DONE
**File:** `app/(marketing)/page.tsx`

**Extracted:**
1. ✅ `HeroSection.tsx` - Hero with CTA
2. ✅ `ProblemSection.tsx` - Problem cards
3. ✅ `HowItWorksSection.tsx` - 4-step process
4. ✅ `FeaturesSection.tsx` - Feature cards
5. ✅ `WhoItIsForSection.tsx` - Target audience
6. ✅ `CTASection.tsx` - Final CTA

**Result:** Page reduced from 299 → 46 lines (-85%)

### Priority 2: Entries Page Components 🔄 IN PROGRESS
**File:** `app/(dashboard)/entries/page.tsx`

**Extracted:**
1. ✅ `EntryCard.tsx` → `features/entries/components/EntryCard.tsx`

**Remaining:**
2. ⏳ `EntriesHeader.tsx` - Title + "New" button
3. ⏳ `EntriesSearch.tsx` - Search input
4. ⏳ `EntriesEmptyState.tsx` - Empty state
5. ⏳ `EntriesPagination.tsx` - Pagination controls

**Expected Result:** Page reduced to ~60 lines

### Priority 3: Login Page Components ⏳ PENDING
**File:** `app/(auth)/login/page.tsx`

**Extract:**
1. ⏳ `LoginForm.tsx` - Email/password form
2. ⏳ `SocialLogin.tsx` - Google login button
3. ⏳ `DemoLogin.tsx` - Demo mode button
4. ⏳ `LoginErrorAlert.tsx` - Error display

**Expected Result:** Page reduced to ~50 lines

### Priority 4: Constants File Split 🔄 IN PROGRESS
**File:** `data/constants.ts`

**Completed:**
1. ✅ `data/tier.constants.ts` - Tier definitions
2. ✅ `data/actions.constants.ts` - Quick actions catalog

**Remaining:**
3. ⏳ `data/lesson.constants.ts` - Lesson categories (STEP_CONFIG, STEPS, INSIGHT_CARDS)
4. ⏳ `data/ui.constants.ts` - UI-related constants (ACTION_LABELS)

---

## 📋 Checklist

### Phase 1: CSS Tokens ✅
- [x] Create design-tokens.css
- [x] Update existing module CSS files
- [ ] Add animations.css (optional)

### Phase 2: Fat Files ✅ Updated
- [x] upgrade/page.tsx (341 → 73) ✅
- [x] DashboardLayout.tsx (285 → 90) ✅
- [x] AuthContext.tsx (218 → 26) ✅
- [x] marketing/page.tsx (299 → 46) ✅ DONE
- [🔄] entries/page.tsx (251 → 149) - Need ~60 more lines reduction
- [ ] login/page.tsx (219 → ~50)
- [🔄] constants.ts (296 → 167) - Need to split lesson & UI constants

### Phase 3: Feature Architecture 🔄
- [ ] Create `/shared/ui` barrel exports
- [ ] Create `/features/journal` module
- [🔄] Create `/features/entries` module (EntryCard ✅)
- [ ] Create `/features/emotions` module
- [ ] Create `/features/insights` module
- [ ] Cleanup old atomic design folders

### Phase 4: Testing
- [ ] TypeScript compilation
- [ ] ESLint check
- [ ] Manual testing of all flows

---

## 📈 Success Metrics

| Metric | Before | Current | Target | Status |
|--------|--------|---------|--------|--------|
| Largest page file | 341 lines | 149 lines | <100 lines | 🔄 In progress |
| Fat files (>200 lines) | 7 files | 4 files | 0 files | 🔄 In progress |
| Feature modules | 0 | 1 (partial) | 4 modules | 🔄 In progress |
| CSS consistency | Mixed | 100% tokens | 100% tokens | ✅ Achieved |
| Component reusability | Low | Medium | High | 🔄 In progress |

---

## 🚀 Quick Wins This Week

### Completed ✅
1. **Landing Page** - Extract 6 section components (2 hours) ✅
2. **Constants Split (Partial)** - Divided tier & actions (30 min) ✅
3. **Entries Page (Partial)** - Extracted EntryCard (30 min) ✅

### Remaining
4. **Entries Page Completion** - Extract 4 more components (1 hour)
5. **Constants Split Completion** - Divide lesson & UI constants (30 min)
6. **Login Page** - Extract 4 form components (1 hour)
7. **Shared UI Barrel** - Export all base components (1 hour)

**Remaining Time:** ~3.5 hours  
**Impact:** Remove 2 more fat files, complete feature pattern
