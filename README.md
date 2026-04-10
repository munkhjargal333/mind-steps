# mind-steps

A Next.js-based mental health journaling SaaS application that helps users track emotions, write reflective journal entries, and gain personal insights through structured journaling flows.

## Features

- **Journal Flow**: Guided reflection process (Surface → Inner Reaction → Meaning → Seed Insight)
- **Entries**: View and manage past journal entries
- **Emotions**: Track and visualize emotion statistics
- **Insights**: AI-powered deep insights from journal entries
- **Tier System**: Free and premium subscription tiers

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with semantic design tokens
- **UI Components**: shadcn/ui primitives
- **Backend**: Supabase (Auth, Database, Storage)
- **State Management**: React Context + Zustand
- **Payments**: QPay integration

## Architecture

This project uses a **feature-driven architecture**:

```
/workspace
├── app/                    # Next.js App Router (thin routing layer)
├── features/               # Feature modules (journal, entries, emotions, insights, auth)
├── shared/                 # Shared code (ui, layout, lib)
├── core/                   # Core application layer (auth, tier, toast providers)
├── styles/                 # Global styles and design tokens
└── types/                  # Global type definitions
```

## Getting Started

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build
```

## Documentation

- [Refactoring Plan](./REFACTORING_PLAN.md) - Detailed migration to feature-driven architecture
