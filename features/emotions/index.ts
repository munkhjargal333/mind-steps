// ════════════════════════════════════════════════════════════════════════════════
// features/emotions/index.ts
// Public API for the emotions feature
// Import from this file to access feature functionality
// ════════════════════════════════════════════════════════════════════════════════

// Views (main entry points for pages)
export { EmotionsView } from './views/EmotionsView';

// Components (for composition if needed)
export {
  EmotionBar,
  EmotionStatsList,
  EmotionsSkeleton,
} from './components';

// Hooks (for data access in other parts of the app)
export { useEmotionStats } from './hooks/useEmotionStats';

// Services (for direct API calls outside React)
export { getEmotionStats } from './services/emotions.service';

// Types (for type annotations)
export type { EmotionStat } from './types';
