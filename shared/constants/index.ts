import type { QuickActionType } from '@/core/api/types';
import { Compass, Flame, Heart, HelpCircle, Layers, LucideIcon, Shield, Sun, Target, Users, Zap } from 'lucide-react';

export { NAV_ITEMS } from './navItems';

export const PLANS = [
  {
    id: 'demo',
    label: 'Demo',
    price: 'Үнэгүй',
    sub: 'Туршиж үзэх',
    color: 'text-muted-foreground',
    badge: '',
    description: '2 минутын дотор өөрийгөө ойлгож үзэх',
    highlight: '',
    features: [
      { text: '3 хүртэлх тэмдэглэл',     ok: true  },
      { text: 'Тэмдэглэлийн шинжилгээ',   ok: true  },
      { text: 'Gemini AI 2.5',             ok: true  },
      { text: 'Түүх хадгалах',             ok: false },
      { text: 'Давтамж илрүүлэх',          ok: false },
      { text: 'Паттерн шинжилгээ',         ok: false },
    ],
  },
  {
    id: 'free',
    label: 'Free',
    price: 'Үнэгүй',
    sub: 'Өдөр тутам',
    color: 'text-primary',
    badge: '',
    description: 'Өөрийгөө ажиглах зуршил үүсгэнэ',
    highlight: '',
    features: [
      { text: 'Өдөрт 3–5 тэмдэглэл',      ok: true  },
      { text: 'Тэмдэглэлийн шинжилгээ',   ok: true  },
      { text: 'Gemini AI 2.5',             ok: true  },
      { text: 'Түүх хадгалах',             ok: true  },
      { text: 'Давтамж илрүүлэх',          ok: true  },
      { text: 'Өсөлт tracking',            ok: false },
      { text: 'Паттерн шинжилгээ',         ok: false },
    ],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '9,900₮',
    sub: 'сард',
    color: 'text-accent',
    badge: 'Шилдэг',
    description: 'Өөрийгөө гүн ойлгож, дотоод өөрчлөлт эхлүүлнэ',
    highlight: 'Давтагддаг бодлуудаа олж харна',
    features: [
      { text: 'Хязгааргүй тэмдэглэл',     ok: true  },
      { text: 'Тэмдэглэлийн шинжилгээ',   ok: true  },
      { text: 'Gemini AI 3.0',             ok: true  },
      { text: 'Давтамж илрүүлэх',          ok: true  },
      { text: 'Өсөлт tracking',            ok: true  },
      { text: 'Паттерн шинжилгээ',         ok: true  },
      { text: 'Зөвлөмж, зөвлөгөө',        ok: true  },
    ],
  },
] as const

export const TIERS = ['free', 'demo', 'pro'] as const;
export type Tier = (typeof TIERS)[number];

export const PERMISSIONS = {
  view_insights: ["free",'pro'],
  view_emotions: ["free",'pro'],
  view_graph:    ["free",'pro'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function can(tier: Tier, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(tier);
}

export const TIER_LABEL: Record<string, string> = {
  pro:     'PRO',
  premium: 'PRE',
};


// ─── Action catalog ───────────────────────────────────────────

export interface ActionConfig {
  type: QuickActionType;
  label: string;
  sub: string;
  icon: LucideIcon;
  tier: Tier;
  /** Semantic token class for icon/text colour — maps to --color-action-* */
  color: string;
  /** Semantic token class for background tint — uses alpha modifier */
  bg: string;
  /** Semantic token class for ring colour — uses alpha modifier */
  ring: string;
  // Seed Insight label
  insightLabel?: string;
}

export const ALL_ACTIONS2: ActionConfig[] = [
  // ── FREE (4) ──────────────────────────────────────────────
  {
    type: 'stress',
    label: 'Стресс',
    sub: 'Түгшүүрээ багасгах',
    insightLabel: 'Юу дарамт үүсгээд байгааг харах',
    icon: Zap,
    tier: 'free',
    color: 'text-action-stress',
    bg: 'bg-action-stress/8',
    ring: 'ring-action-stress/20',
  },
  {
    type: 'loneliness',
    label: 'Ганцаардал',
    sub: 'Дотроо ярих',
    insightLabel: 'Яг юуг үгүйлээд байгааг мэдэх',
    icon: Users,
    tier: 'free',
    color: 'text-action-loneliness',
    bg: 'bg-action-loneliness/8',
    ring: 'ring-action-loneliness/20',
  },
  {
    type: 'self_doubt',
    label: 'Өөртөө эргэлзэх',
    sub: 'Өөрийгөө ойлгох',
    insightLabel: 'Чамд юу саад болж байгааг таних',
    icon: HelpCircle,
    tier: 'free',
    color: 'text-action-self-doubt',
    bg: 'bg-action-self-doubt/8',
    ring: 'ring-action-self-doubt/20',
  },
  {
    type: 'fear',
    label: 'Айдас',
    sub: 'Аюулгүй болгох',
    insightLabel: 'Айдасыг нэрлэх',
    icon: Shield,
    tier: 'free',
    color: 'text-action-fear',
    bg: 'bg-action-fear/8',
    ring: 'ring-action-fear/20',
  },

  // ── PRO (4) ───────────────────────────────────────────────
  {
    type: 'purpose',
    label: 'Зорилго олох',
    sub: 'Чиглэлээ тодорхойлох',
    insightLabel: 'Утга учир харах',
    icon: Target,
    tier: 'pro',
    color: 'text-action-purpose',
    bg: 'bg-action-purpose/8',
    ring: 'ring-action-purpose/20',
  },
  {
    type: 'values',
    label: 'Үнэт зүйл',
    sub: 'Юу чухалыг мэдэх',
    insightLabel: 'Үнэт зүйл тунгаах',
    icon: Compass,
    tier: 'pro',
    color: 'text-action-values',
    bg: 'bg-action-values/8',
    ring: 'ring-action-values/20',
  },
  {
    type: 'gratitude',
    label: 'Талархал',
    sub: 'Сайхныг олж харах',
    insightLabel: 'Гүн талархах',
    icon: Heart,
    tier: 'pro',
    color: 'text-action-gratitude',
    bg: 'bg-action-gratitude/8',
    ring: 'ring-action-gratitude/20',
  },
  {
    type: 'joy',
    label: 'Баяр',
    sub: 'Агшинг тэмдэглэх',
    insightLabel: 'Баяр гүнзгийрүүлэх',
    icon: Sun,
    tier: 'pro',
    color: 'text-action-joy',
    bg: 'bg-action-joy/8',
    ring: 'ring-action-joy/20',
  },
];

export const ALL_ACTIONS: ActionConfig[] = [
  // ── FREE (4) ──────────────────────────────────────────────
  {
    type: 'stress',
    label: 'Стресс',
    sub: 'Түгшүүрээ багасгах',
    insightLabel: 'Юу дарамт үүсгээд байгааг харах',
    icon: Zap,
    tier: 'free',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    ring: 'ring-orange-200 dark:ring-orange-800',
  },
  {
    type: 'loneliness',
    label: 'Ганцаардал',
    sub: 'Дотроо ярих',
    insightLabel: 'Яг юуг үгүйлээд байгааг мэдэх',
    icon: Users,
    tier: 'free',
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/20',
    ring: 'ring-sky-200 dark:ring-sky-800',
  },
  {
    type: 'self_doubt',
    label: 'Өөртөө эргэлзэх',
    sub: 'Өөрийгөө ойлгох',
    insightLabel: 'Чамд юу саад болж байгааг таних',
    icon: HelpCircle,
    tier: 'free',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    ring: 'ring-amber-200 dark:ring-amber-800',
  },
  {
    type: 'fear',
    label: 'Айдас',
    sub: 'Аюулгүй болгох',
    insightLabel: 'Айдасыг нэрлэх',
    icon: Shield,
    tier: 'free',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    ring: 'ring-indigo-200 dark:ring-indigo-800',
  },

  // ── PRO (4) ───────────────────────────────────────────────
  {
    type: 'purpose',
    label: 'Зорилго олох',
    sub: 'Чиглэлээ тодорхойлох',
    insightLabel: 'Утга учир харах',
    icon: Target,
    tier: 'pro',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    ring: 'ring-violet-200 dark:ring-violet-800',
  },
  {
    type: 'values',
    label: 'Үнэт зүйл',
    sub: 'Юу чухалыг мэдэх',
    insightLabel: 'Үнэт зүйл тунгаах',
    icon: Compass,
    tier: 'pro',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/20',
    ring: 'ring-teal-200 dark:ring-teal-800',
  },
  {
    type: 'gratitude',
    label: 'Талархал',
    sub: 'Сайхныг олж харах',
    insightLabel: 'Гүн талархах',
    icon: Heart,
    tier: 'pro',
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    ring: 'ring-rose-200 dark:ring-rose-800',
  },
  {
    type: 'joy',
    label: 'Баяр',
    sub: 'Агшинг тэмдэглэх',
    insightLabel: 'Баяр гүнзгийрүүлэх',
    icon: Sun,
    tier: 'pro',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    ring: 'ring-yellow-200 dark:ring-yellow-800',
  },
];


export const FREE_ACTIONS  = ALL_ACTIONS.filter((a) => a.tier === 'free');
export const PRO_ACTIONS   = ALL_ACTIONS.filter((a) => a.tier === 'pro');

export const ACTION_MAP = Object.fromEntries(
  ALL_ACTIONS.map((a) => [a.type, a]),
) as Record<string, ActionConfig>;

// ─── Step indicator metadata ──────────────────────────────────

export const STEPS: { label: string; icon: LucideIcon }[] = [
  { label: 'Гадаргуу', icon: Layers },
  { label: 'Дотоод',   icon: Flame  },
  { label: 'Утга',     icon: Compass },
];

// ─── Per-action question copy ─────────────────────────────────

export interface StepCopy {
  surface: { q: string; placeholder: string };
  inner:   { q: string; placeholder: string };
  meaning: { q: string; placeholder: string };
}

export const STEP_CONFIG: Record<string, StepCopy> = {
  stress: {
    surface: {
      q: 'Сүүлийн үед толгойн өвчин болоод байгаа асуудал?',
      placeholder: '...',
    },
    inner: {
      q: 'Тэр үед чи өөрийгөө тайвшруулахын тулд ихэвчлэн юу хийдэг вэ?',
      placeholder: '...',
    },
    meaning: {
      q: 'Яг үнэндээ чи юу өөрчлөгдөөсэй гэж хүсэж байна?',
      placeholder: '...',
    },
  },

  loneliness: {
    surface: {
      q: 'Сүүлийн үед дотор чинь нэг л дутуу юм шиг санагдсан юм байсан уу?',
      placeholder: '...',
    },
    inner: {
      q: 'Тэр мэдрэмж төрөх үед чи ихэвчлэн хүмүүст ойртдог уу, эсвэл өөрийгөө татаж холдуулдаг уу?',
      placeholder: '...',
    },
    meaning: {
      q: 'Яг үнэндээ чи хэзээ “би ганцаараа биш” гэж мэдэрдэг вэ?',
      placeholder: '...',
    },
  },

  self_doubt: {
    surface: {
      q: 'Сүүлийн үед “би зөв хийж байна уу?” гэж өөртөө эргэлзсэн зүйл юу байна?',
      placeholder: '...',
    },
    inner: {
      q: 'Эргэлзээ төрөх үед шийдвэрээ олохын тулд юу хийдэг вэ?',
      placeholder: '...',
    },
    meaning: {
      q: 'Яг тэр үед чи дотроо юуг хамгийн их хүсдэг вэ?',
      placeholder: '...',
    },
  },

  fear: {
    surface: {
      q: 'Бодохын төдий дотор арзайлгаж, шар үс босгодог сэдэв?',
      placeholder: '...',
    },
    inner: {
      q: 'Энэ зүйлээс хол байхын тулд ихэвчлэн юу хийдэг вэ?',
      placeholder: '...',
    },
    meaning: {
      q: 'Яг үнэндээ чи юуг хамгаалж үлдэхийг зориж байна вэ?',
      placeholder: '...',
    },
  },

  purpose: {
    surface: {
      q: 'Сүүлийн үед “яагаад энэ чухал юм бол?” гэж өөрөөсөө асуух шиг болсон зүйл байна уу?',
      placeholder: 'өдөр тутмын ажил, хичээл, утга нь бүдгэрсэн зорилго, хийж л байгаа ч дотроосоо хол санагдах зүйлс...',
    },
    inner: {
      q: 'Тэр хоосон мэдрэмж орж ирэх үед чи ихэвчлэн юу хийхийг оролддог вэ?',
      placeholder: 'өөрийгөө завгүй байлгах, шинэ зүйл хайх, гадаргуур зүйлсээр анхаарлаа сарниулах, зүгээр л орхих...',
    },
    meaning: {
      q: 'Яг ямар үед чи “би чухал юм хийж байна” гэж үнэхээр мэдэрдэг вэ?',
      placeholder: 'хэн нэгэнд нөлөөлж байгаа үед, өөрийгөө давж байгаа үед, үнэхээр сонирхдог зүйл дээрээ ажиллах үед...',
    },
  },

  gratitude: {
    surface: {
      q: 'Өнөөдөр жижиг ч гэсэн “энэ сайхан байна” гэж дотроо бодогдсон мөч байсан уу?',
      placeholder: 'жижиг амжилт, тайван агшин, хэн нэгний үг, дулаан мэдрэмж төрсөн үе...',
    },
    inner: {
      q: 'Тэр мэдрэмж орж ирэх үед чи ихэвчлэн яаж хүлээж авдаг вэ?',
      placeholder: 'түрхэн зуур анзаараад өнгөрөх, дотроо хадгалах, хэн нэгэнд хуваалцах, эсвэл бүр анзааралгүй өнгөрөх...',
    },
    meaning: {
      q: 'Тэр мөч чамд амьдралд чинь аль хэдийн байгаа ямар үнэ цэнийг сануулж байна вэ?',
      placeholder: 'хангалттай байгаагаа, аль хэдийн сайхан зүйлс байгаа гэдгийг, жижиг зүйлс ч утгатай гэдгийг...',
    },
  },

  values: {
    surface: {
      q: 'Сүүлийн үед “энэ нэг л зөв биш” гэж дотроо хүчтэй мэдэрсэн зүйл байсан уу?',
      placeholder: 'өөрийн эсвэл бусдын үйлдэл, хэлэгдээгүй үг, тэвчихэд хэцүү нөхцөл байдал...',
    },
    inner: {
      q: 'Тэр үед чи ихэвчлэн яахыг оролддог вэ?',
      placeholder: 'засах гэж оролдох, дуугүй тэвчих, зайлсхийх, дотроо бухимдлаа хадгалах...',
    },
    meaning: {
      q: 'Яг үнэндээ тэр бүхний цаана чи юуг зөв, үнэн байгаасай гэж хүсэж байна?',
      placeholder: 'шударга байдал, үг ба үйлдэл нийцэх, харилцаанд ил тод байх...',
    },
  },

  joy: {
    surface: {
      q: 'Сүүлийн үед чамайг гэнэт дотроос нь дүүргэж, инээмсэглэл авчирсан мөч байсан уу?',
      placeholder: 'санаандгүй сайхан агшин, хүний үг, хамт байхын мэдрэмж...',
    },
    inner: {
      q: 'Тэр баяр орж ирэх үед чи ихэвчлэн юу хийдэг вэ?',
      placeholder: 'хэн нэгэнтэй хуваалцах, дотроо хадгалах, үргэлжлүүлэхийг хүсэх, эсвэл зүгээр өнгөрөөх...',
    },
    meaning: {
      q: 'Тэр мөч чамд амьдралд чинь юу үнэхээр үнэ цэнэтэй байгааг сануулж байна вэ?',
      placeholder: 'чөлөөтэй байх, хайртай хүмүүстэйгээ байх, жижиг зүйлсийг мэдрэх, өөрийгөө байх...',
    },
  },
};



export const ACTION_LABELS: Record<string, string> = {
  stress: 'стресс', loneliness: 'ганцаардал', gratitude: 'талархал',
  self_doubt: 'өөртөө эргэлзэх', purpose: 'зорилго олох',
  values: 'үнэт зүйл', fear: 'айдас', joy: 'баяр',
};

// ─── Seed Insight cards ───────────────────────────────────────
// All colours use semantic insight tokens from globals.css.


export const INSIGHT_CARDS = [
  {
    key: 'mirror',
    label: 'Mirror',
    sub: '🫂 Чи ганцаараа биш',
    dot: 'bg-[color:var(--color-insight-mirror,theme(colors.blue.400))]',
    bg: 'bg-blue-50/60 dark:bg-blue-950/15',
  },
  {
    key: 'reframe',
    label: 'Reframe',
    sub: '🌀 Өөр өнцгөөс харвал',
    dot: 'bg-[color:var(--color-insight-reframe,theme(colors.violet.400))]',
    bg: 'bg-violet-50/60 dark:bg-violet-950/15',
  },
  {
    key: 'relief',
    label: 'Relief',
    sub: '🌱 Дотоод хүч чинь байсаар',
    dot: 'bg-[color:var(--color-insight-relief,theme(colors.emerald.400))]',
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/15',
  },
  // {
  //   key: 'summary',
  //   label: 'Summary',
  //   sub: 'Хураангуй',
  //   dot: 'bg-amber-400',
  //   bg: 'bg-amber-50/60 dark:bg-amber-950/15',
  // },
] as const;

export type InsightKey = (typeof INSIGHT_CARDS)[number]['key'];
