import type { QuickActionType } from '@/core/api/types';

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

export const ALL_ACTIONS: ActionConfig[] = [
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
      q: 'Сүүлийн үед толгойноос чинь гарахгүй эргэлдээд, чамайг дотроос нь шахаад байгаа зүйл юу байна?',
      placeholder: 'хийж амжихгүй байгаа ажил, шийдэгдээгүй асуудал, хүлээлт нэмэгдэх тусам амсхийх завгүй болох...',
    },
    inner: {
      q: 'Тэр бодол орж ирэх үед чи өөрийгөө яаж зохицуулах гэж оролддог вэ?',
      placeholder: 'дахиад дахин шалгах, хэт их бодож төлөвлөх, өөр зүйлд сатаарах, юу ч хийж чадахгүй гацаанд орох...',
    },
    meaning: {
      q: 'Яг тэр мөчид чи дотроо юуг өөрчлөгдсөн байгаасай гэж хамгийн их хүсдэг вэ?',
      placeholder: 'цаг хугацаа зогсоосой, энэ ажил өөрөө бүтчихээсэй, хэн нэгэн ирээд надад туслаасай, энэ нөхцөл байдлаас шууд алга болчихмоор...',
    },
  },

  loneliness: {
    surface: {
      q: 'Сүүлийн үед ямар нэг зүйл дутуу юм шиг мэдрэмж төрсөн мөч байсан уу?',
      placeholder: 'ойлголцох хүн байхгүй санагдах, хүмүүсийн дунд байвч ганцаараа мэт мэдрэгдэх, хуваалцах зүйл дотроо үлдэх...',
    },
    inner: {
      q: 'Тэр мэдрэмж төрөх үед чи ихэвчлэн хүмүүс рүү ойртдог уу, эсвэл өөрөөсөө холдуулдаг уу?',
      placeholder: 'утсаа оролдох, хэн нэгэнд бичих гэж байгаад больчих, хүнээс зайлсхийх, өөрийгөө дотогшоо татах...',
    },
    meaning: {
      q: 'Яг үнэндээ чамд би ганцаараа биш гэж мэдрэгдэх тэр мөч ямар байдаг вэ?',
      placeholder: 'хэн нэгэн шүүмжлэлгүй сонсох, зүгээр л хамт байж өгөх, өөрийг чинь үнэхээр ойлгож байгаа мэт санагдах...',
    },
  },

  self_doubt: {
    surface: {
      q: 'Сүүлийн үед би үнэхээр зөв хийж байна уу? гэж өөртөө эргэлзсэн зүйл юу байна?',
      placeholder: 'шийдвэр гаргахдаа тээнэгэлзэх, буруу сонголт хийчих вий гэж айх, хийж чадах эсэхдээ итгэлгүй байх...',
    },
    inner: {
      q: 'Эргэлзээ төрөх үед чи өөртэйгөө яаж харьцдаг вэ?',
      placeholder: 'дахин дахин баталгаа хайх, шийдвэрээ хойшлуулах, хэт их мэдээлэл цуглуулах, эхлүүлэлгүй орхих...',
    },
    meaning: {
      q: 'Яг тэр үед чи дотроо ямар мэдрэмжийг хамгийн ихээр хүсдэг вэ?',
      placeholder: 'алдах эрхтэй мэт санагдах, "би хангалттай" гэсэн дотоод баталгаа, төгс биш байсан ч урагшлах итгэл...',
    },
  },

  fear: {
    surface: {
      q: 'Сүүлийн үед өөрийн эрхгүй орж ирээд, зүрхийг чинь агшаадаг бодол юу байна?',
      placeholder: 'ямар нэг зүйл буруу эргэх вий, хайртай хүнээ алдах вий, гэнэт бүх зүйл нурчих вий...',
    },
    inner: {
      q: 'Тэр айдас мэдрэгдэх үед чи ихэвчлэн яаж хариу үйлдэл үзүүлдэг вэ?',
      placeholder: 'хэт их бэлтгэх, бүхнийг тооцоолох, бодохоос зайлсхийх, хэнд ч хэлэхгүй дотроо хадгалах...',
    },
    meaning: {
      q: 'Яг үнэндээ чи дотроо юуг хамгаалж үлдэхийг хамгийн их хүсэж байна вэ?',
      placeholder: 'өөртөө итгэх итгэл, хайртай хүмүүсээ алдахгүй байх, бүх зүйл нурсан ч давах чадвартай байх мэдрэмж...',
    },
  },

  purpose: {
    surface: {
      q: 'Сүүлийн үед юуг хийхдээ "яагаад энэ чухал юм бол" гэж гэнэт асуух мэт санагдсан уу?',
      placeholder: 'өдөр тутмын ажил, хичээл, харилцаа, хойшлуулаад байгаа зорилго...',
    },
    inner: {
      q: 'Тэр хоосон мэдрэмж орж ирэх үед чи ихэвчлэн юу хийхийг оролддог вэ?',
      placeholder: 'завгүй болох, шинэ зүйл хайх, гадаргуур хүнтэй байх, хэт их унтах...',
    },
    meaning: {
      q: 'Яг үнэндээ ямар мөчид "чухал юм хийж байна" гэсэн мэдрэмж чамд үнэхээр төрдөг вэ?',
      placeholder: 'хэн нэгэнд нөлөөлөх, өөрийгөө давах, үнэхээр сонирхдог зүйлээ хийх, хүн хүлээж байх...',
    },
  },

  gratitude: {
    surface: {
      q: 'Өнөөдөр жижиг ч гэсэн "за, энэ сайхан байна" гэж дотроо чимэглэсэн мөч байсан уу?',
      placeholder: 'дулааны мэдрэмж, бүтсэн ажил, хэн нэгний үг, тайван агшин...',
    },
    inner: {
      q: 'Тэр сайхан мэдрэмж орж ирэх үед чи үүнийгээ ихэвчлэн хэрхэн хүлээж авдаг вэ?',
      placeholder: 'дотроо тэмдэглэх, хэн нэгэнд хэлэх, үргэлжлүүлэхийг хүсэх, хурдан мартах...',
    },
    meaning: {
      q: 'Энэ мөч чамд амьдралдаа аль хэдийнэ байгаа ямар үнэт зүйлийг сануулж байна вэ?',
      placeholder: 'хангалттай байгаагаа, хайрлагдаж байгаагаа, нэг өдрийг бүтээж чадсанаа...',
    },
  },

  values: {
    surface: {
      q: 'Сүүлийн үед "энэ зөв биш" гэж дотроо хурцаар мэдэрсэн нөхцөл байдал байсан уу?',
      placeholder: 'хэн нэгний үйлдэл, өөрийн шийдвэр, хэлэгдээгүй үг, тэвчихэд хэцүү нөхцөл...',
    },
    inner: {
      q: 'Тэр мэдрэмж төрөх үед чи ихэвчлэн юу хийхийг оролддог вэ?',
      placeholder: 'засах гэж оролдох, хэлэхгүй тэвчих, зайлсхийх, дотроо буцалгах...',
    },
    meaning: {
      q: 'Яг үнэндээ тэрхүү зөрчлийн цаана чи юу үнэнч, зөв байгаасай гэж хүсэж байгаа юм бэ?',
      placeholder: 'шударга байдал, үгээ үйлдэлтэй нийцүүлэх, харилцааны ил тод байдал...',
    },
  },

  joy: {
    surface: {
      q: 'Сүүлийн үед чамайг гэнэт дотроос нь дүүргэж, нүүрэнд нь инээмсэглэл авчирсан зүйл байсан уу?',
      placeholder: 'санаанаас гадуур агшин, хүний үг, хамт байхын тухай мэдрэмж...',
    },
    inner: {
      q: 'Тэр баяр орж ирэх үед чи ихэвчлэн юу хийдэг вэ?',
      placeholder: 'хэн нэгэнтэй хуваалцах, дотроо хадгалах, үргэлжлүүлэхийг хүсэх, санаанаас арчих...',
    },
    meaning: {
      q: 'Яг үнэндээ тэр агшин чамд амьдралд чинь ямар зүйл үнэ цэнэтэй байгааг сануулж байна вэ?',
      placeholder: 'чөлөөтэй байх, хайртай хүмүүстэйгээ байх, өчүүхэн зүйлд анхаарах, өөрийгөө байх...',
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
    key: 'mirror'  as const,
    label: 'Mirror',
    sub: '🫂 Чи дангаараа биш',
    dot: 'bg-insight-mirror',
    bg: 'bg-insight-mirror/8',
  },
  {
    key: 'reframe' as const,
    label: 'Reframe',
    sub: '🌀 Өөр өнцгөөс харвал',
    dot: 'bg-insight-reframe',
    bg: 'bg-insight-reframe/8',
  },
  {
    key: 'relief'  as const,
    label: 'Relief',
    sub: '🌱 Дотоод хүч чинь байсаар',
    dot: 'bg-insight-relief',
    bg: 'bg-insight-relief/8',
  },
] as const;
