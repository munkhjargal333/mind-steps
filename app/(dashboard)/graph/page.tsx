'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/core/auth';                  
import { getValueGraph } from '@/core/api';             
import { type GraphData } from '@/core/api';            
import { Button } from '@/shared/ui/button';            
import { cn } from '@/shared/utils/cn';                 
import {
  Network, Loader2, AlertCircle, RefreshCw,
  X, Heart, Repeat2, Hash, Layers,
} from 'lucide-react';

// ── Тохиргоо ──────────────────────────────────────────────────────────────────

const NODE_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f97316',
  '#14b8a6', '#3b82f6', '#f59e0b', '#f43f5e',
];

const MASLOW_LABELS: Record<string, string> = {
  physiological:      'Физиологийн хэрэгцээ',
  social:             'Харилцаа, нийгэм',
  safety:             'Аюулгүй байдал',
  love:               'Хайр, харьяалал',
  esteem:             'Хүндэтгэл',
  self_actualization: 'Өөрийгөө илэрхийлэх',
};

const MASLOW_EMOJI: Record<string, string> = {
  physiological:      '🌿',
  safety:             '🛡️',
  love:               '❤️',
  esteem:             '⭐',
  self_actualization: '🔥',
};

const MASLOW_ORDER = [
  'physiological',
  'safety',
  'love',
  'esteem',
  'self_actualization',
];

// ── Hawkins edge визуал ───────────────────────────────────────────────────────

interface EdgeStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray: string;
  strokeOpacity: number;
}

function hawkinsEdgeStyle(edge: RawEdge, isHighlighted: boolean): EdgeStyle {
  const lvl = edge.hawkins_level_avg ?? 200;

  let stroke: string;
  if      (lvl < 100) stroke = '#f87171';
  else if (lvl < 200) stroke = '#fb923c';
  else if (lvl < 400) stroke = '#94a3b8';
  else if (lvl < 600) stroke = '#4ade80';
  else                stroke = '#60a5fa';

  const interactions = edge.interaction_count ?? 1;
  const strokeWidth = isHighlighted
    ? Math.min(1.5 + interactions * 0.4, 5)
    : Math.min(0.8 + interactions * 0.25, 3);

  const strokeDasharray = lvl < 200 ? '5 4' : '0';
  const strokeOpacity   = isHighlighted ? 0.85 : 0.3;

  return { stroke, strokeWidth, strokeDasharray, strokeOpacity };
}

function hawkinsLabel(level: number): { text: string; color: string } {
  if      (level < 100) return { text: 'Аюултай',            color: '#f87171' };
  else if (level < 200) return { text: 'Айдастай',           color: '#fb923c' };
  else if (level < 400) return { text: 'Хүлээн зөвшөөрсөн', color: '#94a3b8' };
  else if (level < 600) return { text: 'Хөгжиж буй',        color: '#4ade80' };
  else                  return { text: 'Аз жаргал',          color: '#60a5fa' };
}

const EMOTION_LABELS: Record<string, string> = {
  joy:          'Баяр',
  trust:        'Итгэл',
  fear:         'Айдас',
  surprise:     'Гайхал',
  sadness:      'Гуниг',
  disgust:      'Жигшил',
  anger:        'Уур',
  anticipation: 'Хүлээлт',
};

const EMOTION_COLORS: Record<string, string> = {
  joy:          '#facc15',
  trust:        '#4ade80',
  fear:         '#a78bfa',
  surprise:     '#fb923c',
  sadness:      '#60a5fa',
  disgust:      '#86efac',
  anger:        '#f87171',
  anticipation: '#fbbf24',
};

// ── Төрлүүд ───────────────────────────────────────────────────────────────────

interface RawNode {
  id: string;
  maslow_category: string;
  maslow_value: string;
  weight: number;
  mention_count: number;
  dominant_primary: string | null;
  dominant_dyad: string | null;
}

interface RawEdge {
  id: string;
  node_a_id: string;
  node_b_id: string;
  hawkins_level_avg: number;
  hawkins_score_avg: number;
  interaction_count: number;
}

interface LayoutNode extends RawNode {
  x: number;
  y: number;
  size: number;
  color: string;
}

// ── Layout тооцоолол (force-directed) ────────────────────────────────────────

function parseRaw(raw: GraphData): { rawNodes: RawNode[]; rawEdges: RawEdge[] } {
  const rawNodes: RawNode[] = Array.isArray(raw.nodes)
    ? raw.nodes.map((node: any) => ({
        id: node.id ?? '',
        maslow_category: node.maslow_category ?? '',
        maslow_value: node.label ?? node.maslow_value ?? '',
        weight: node.weight ?? 0,
        mention_count: node.mention_count ?? 0,
        dominant_primary: node.dominant_primary ?? null,
        dominant_dyad: node.dominant_dyad ?? null,
      }))
    : [];
  const rawEdges: RawEdge[] = Array.isArray(raw.edges)
    ? raw.edges.map((edge: any) => ({
        id: edge.id ?? '',
        node_a_id: edge.source ?? edge.node_a_id ?? '',
        node_b_id: edge.target ?? edge.node_b_id ?? '',
        hawkins_level_avg: edge.hawkins_level_avg ?? 200,
        hawkins_score_avg: edge.hawkins_score_avg ?? 0,
        interaction_count: edge.interaction_count ?? 0,
      }))
    : [];
  return { rawNodes, rawEdges };
}

function forceLayout(
  rawNodes: RawNode[],
  rawEdges: RawEdge[],
  W: number,
  H: number,
): LayoutNode[] {
  if (rawNodes.length === 0) return [];

  const maxMention = Math.max(...rawNodes.map((n) => n.mention_count), 1);

  // Эхний байршил — тойргоор тараана
  const positions: { x: number; y: number }[] = rawNodes.map((_, i) => {
    const angle = (2 * Math.PI * i) / rawNodes.length - Math.PI / 2;
    const r = Math.min(W, H) * 0.32;
    return {
      x: W / 2 + r * Math.cos(angle),
      y: H / 2 + r * Math.sin(angle),
    };
  });

  const idxMap = Object.fromEntries(rawNodes.map((n, i) => [n.id, i]));

  // Force simulation — 120 давталт
  for (let iter = 0; iter < 120; iter++) {
    const alpha = 1 - iter / 120;
    const forces: { fx: number; fy: number }[] = rawNodes.map(() => ({ fx: 0, fy: 0 }));

    // Repulsion (бие биенээс зайлах)
    for (let a = 0; a < rawNodes.length; a++) {
      for (let b = a + 1; b < rawNodes.length; b++) {
        const dx = positions[b].x - positions[a].x;
        const dy = positions[b].y - positions[a].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const repulse = (4800 / (dist * dist)) * alpha;
        forces[a].fx -= (dx / dist) * repulse;
        forces[a].fy -= (dy / dist) * repulse;
        forces[b].fx += (dx / dist) * repulse;
        forces[b].fy += (dy / dist) * repulse;
      }
    }

    // Attraction (холбоос татах)
    for (const e of rawEdges) {
      const ai = idxMap[e.node_a_id];
      const bi = idxMap[e.node_b_id];
      if (ai == null || bi == null) continue;
      const dx = positions[bi].x - positions[ai].x;
      const dy = positions[bi].y - positions[ai].y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const strength = 0.04 * alpha;
      forces[ai].fx += dx * strength;
      forces[ai].fy += dy * strength;
      forces[bi].fx -= dx * strength;
      forces[bi].fy -= dy * strength;
    }

    // Center gravity (төв рүү татах)
    for (let i = 0; i < rawNodes.length; i++) {
      forces[i].fx += (W / 2 - positions[i].x) * 0.012 * alpha;
      forces[i].fy += (H / 2 - positions[i].y) * 0.012 * alpha;
    }

    // Байршил шинэчлэх
    for (let i = 0; i < rawNodes.length; i++) {
      positions[i].x = Math.max(40, Math.min(W - 40, positions[i].x + forces[i].fx));
      positions[i].y = Math.max(40, Math.min(H - 40, positions[i].y + forces[i].fy));
    }
  }

  return rawNodes.map((n, i) => ({
    ...n,
    x: positions[i].x,
    y: positions[i].y,
    size: 14 + (n.mention_count / maxMention) * 12,
    color: NODE_COLORS[i % NODE_COLORS.length],
  }));
}

function layoutGraph(raw: GraphData): { nodes: LayoutNode[]; edges: RawEdge[] } {
  const { rawNodes, rawEdges } = parseRaw(raw);
  if (rawNodes.length === 0) return { nodes: [], edges: [] };

  const W = 600;
  const H = 480;
  const nodes = forceLayout(rawNodes, rawEdges, W, H);
  const nodeIds = new Set(nodes.map((n) => n.id));
  const edges = rawEdges.filter(
    (e) => nodeIds.has(e.node_a_id) && nodeIds.has(e.node_b_id)
  );
  return { nodes, edges };
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function NodeDetail({
  node,
  connectedEdges,
  nodeMap,
  onClose,
  onSelectNode,
}: {
  node: LayoutNode;
  connectedEdges: RawEdge[];
  nodeMap: Record<string, LayoutNode>;
  onClose: () => void;
  onSelectNode: (id: string) => void;
}) {
  const emotionColor = node.dominant_primary
    ? EMOTION_COLORS[node.dominant_primary] ?? '#94a3b8'
    : '#94a3b8';

  const connectedItems = connectedEdges
    .map((e) => {
      const otherId = e.node_a_id === node.id ? e.node_b_id : e.node_a_id;
      const other = nodeMap[otherId];
      return other ? { node: other, edge: e } : null;
    })
    .filter(Boolean) as { node: LayoutNode; edge: RawEdge }[];

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5 space-y-4 animate-in slide-in-from-bottom-2 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
            style={{ backgroundColor: node.color }}
          />
          <div>
            <p className="font-semibold text-base leading-tight">{node.maslow_value}</p>
            <p className="text-xs text-white/50 mt-0.5">
              {MASLOW_LABELS[node.maslow_category] ?? node.maslow_category}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-xl flex-shrink-0"
          onClick={onClose}
        >
          <X size={14} />
        </Button>
      </div>

      {/* Статистик */}
      <div className="grid grid-cols-3 gap-2">
        <StatCard
          icon={<Hash size={12} />}
          label="Дурдагдсан"
          value={`${node.mention_count} удаа`}
        />
        <StatCard
          icon={<Layers size={12} />}
          label="Жин"
          value={node.weight.toFixed(2)}
        />
        <StatCard
          icon={<Repeat2 size={12} />}
          label="Холбоос"
          value={`${connectedEdges.length} утас`}
        />
      </div>

      {/* Сэтгэл хөдлөл */}
      {node.dominant_primary && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wide">
            Голлох сэтгэл хөдлөл
          </p>
          <div className="flex flex-wrap gap-2">
            <EmotionBadge
              emotion={node.dominant_primary}
              color={emotionColor}
              icon={<Heart size={10} />}
            />
            {node.dominant_dyad && (
              <EmotionBadge
                emotion={node.dominant_dyad}
                color="#94a3b8"
                label="Хосолмол"
              />
            )}
          </div>
        </div>
      )}

      {/* Холбоотой үнэт зүйлс */}
      {connectedItems.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wide">
            Холбоотой үнэт зүйлс
          </p>
          <div className="flex flex-col gap-1.5">
            {connectedItems.map(({ node: other, edge }) => {
              const hw = hawkinsLabel(edge.hawkins_level_avg ?? 200);
              return (
                <button
                  key={other.id}
                  onClick={() => onSelectNode(other.id)}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: other.color }}
                    />
                    <span className="text-sm font-medium truncate">{other.maslow_value}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: hw.color + '20',
                        color: hw.color,
                      }}
                    >
                      {hw.text}
                    </span>
                    <span className="text-[10px] text-white/50">
                      ×{edge.interaction_count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 space-y-1">
      <div className="flex items-center gap-1 text-white/50">
        {icon}
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function EmotionBadge({
  emotion,
  color,
  icon,
  label,
}: {
  emotion: string;
  color: string;
  icon?: React.ReactNode;
  label?: string;
}) {
  return (
    <span
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{ backgroundColor: color + '22', color }}
    >
      {icon}
      {label ? `${label}: ` : ''}
      {EMOTION_LABELS[emotion] ?? emotion}
    </span>
  );
}

// ── Category Filter Bar ───────────────────────────────────────────────────────

function CategoryFilter({
  available,
  active,
  onChange,
}: {
  available: Set<string>;
  active: string | null;
  onChange: (cat: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={cn(
          'px-3 py-1.5 rounded-xl text-sm font-medium transition-all',
          active === null
            ? 'bg-white text-black'
            : 'bg-white/8 text-white/60 hover:bg-white/15 hover:text-white/90',
        )}
      >
        Бүгд
      </button>

      {MASLOW_ORDER.filter((cat) => available.has(cat)).map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(active === cat ? null : cat)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all',
            active === cat
              ? 'bg-white text-black'
              : 'bg-white/8 text-white/60 hover:bg-white/15 hover:text-white',
          )}
        >
          <span>{MASLOW_EMOJI[cat]}</span>
          {MASLOW_LABELS[cat] ?? cat}
        </button>
      ))}
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

function NodeTooltip({ node, svgW }: { node: LayoutNode; svgW: number }) {
  const label   = node.maslow_value;
  const catName = MASLOW_LABELS[node.maslow_category] ?? node.maslow_category;
  const boxW    = Math.max(label.length * 7.5 + 20, 100);
  const boxH    = 44;
  let tx = node.x - boxW / 2;
  tx = Math.max(4, Math.min(svgW - boxW - 4, tx));
  const ty = node.y - node.size - boxH - 8;
  return (
    <g pointerEvents="none">
      <rect x={tx + 2} y={ty + 2} width={boxW} height={boxH} rx={8} ry={8} fill="black" fillOpacity={0.18} />
      <rect x={tx} y={ty} width={boxW} height={boxH} rx={8} ry={8} fill={node.color} fillOpacity={0.95} />
      <text x={tx + boxW / 2} y={ty + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill="white">
        {label}
      </text>
      <text x={tx + boxW / 2} y={ty + 32} textAnchor="middle" fontSize={10} fontWeight={400} fill="white" fillOpacity={0.8}>
        {catName}
      </text>
    </g>
  );
}

// ── Graph SVG ─────────────────────────────────────────────────────────────────

const SVG_W = 600;
const SVG_H = 480;

function GraphView({ data }: { data: GraphData }) {
  const [hovered,        setHovered]        = useState<string | null>(null);
  const [selected,       setSelected]       = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { nodes: allNodes, edges: allEdges } = layoutGraph(data);

  const nodes = activeCategory
    ? allNodes.filter((n) => n.maslow_category === activeCategory)
    : allNodes;
  const visibleIds = new Set(nodes.map((n) => n.id));
  const edges = allEdges.filter(
    (e) => visibleIds.has(e.node_a_id) && visibleIds.has(e.node_b_id),
  );

  const availableCategories = new Set(allNodes.map((n) => n.maslow_category));

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat);
    setSelected(null);
    setHovered(null);
  };

  if (allNodes.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 gap-4 text-center">
        <Network size={32} className="text-white/50/30" />
        <p className="text-sm text-white/50">Граф өгөгдөл байхгүй байна</p>
      </div>
    );
  }

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const selectedNode = selected ? nodeMap[selected] ?? null : null;
  const selectedEdges = selectedNode
    ? edges.filter((e) => e.node_a_id === selected || e.node_b_id === selected)
    : [];

  const active = selected ?? hovered;

  const isNodeFaded = (id: string) => {
    if (!active) return false;
    if (id === active) return false;
    return !edges.some(
      (e) =>
        (e.node_a_id === active && e.node_b_id === id) ||
        (e.node_b_id === active && e.node_a_id === id),
    );
  };

  const tooltipNode = hovered && !selected ? nodeMap[hovered] ?? null : null;

  return (
    <div className="space-y-3">
      <CategoryFilter available={availableCategories} active={activeCategory} onChange={handleCategoryChange} />

      <div className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ maxHeight: SVG_H, display: 'block' }}>
          <g>
            {edges.map((e, i) => {
              const src = nodeMap[e.node_a_id];
              const tgt = nodeMap[e.node_b_id];
              if (!src || !tgt) return null;
              const isHighlighted = active === e.node_a_id || active === e.node_b_id;
              const style = hawkinsEdgeStyle(e, isHighlighted);
              return (
                <line key={i} x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                  stroke={style.stroke} strokeWidth={style.strokeWidth}
                  strokeDasharray={style.strokeDasharray} strokeOpacity={style.strokeOpacity}
                  style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s' }}
                />
              );
            })}
          </g>
          <g>
            {nodes.map((node) => {
              const isActive   = active === node.id;
              const isFaded    = isNodeFaded(node.id);
              const isSelected = selected === node.id;
              return (
                <g key={node.id}
                  onMouseEnter={() => !selected && setHovered(node.id)}
                  onMouseLeave={() => !selected && setHovered(null)}
                  onClick={() => setSelected(isSelected ? null : node.id)}
                  className="cursor-pointer"
                  style={{ opacity: isFaded ? 0.2 : 1, transition: 'opacity 0.2s' }}
                >
                  {isActive && (
                    <circle cx={node.x} cy={node.y} r={node.size + 12} fill={node.color} opacity={0.15} />
                  )}
                  {isSelected && (
                    <circle cx={node.x} cy={node.y} r={node.size + 5} fill="none"
                      stroke={node.color} strokeWidth={2.5} opacity={0.8} />
                  )}
                  <circle cx={node.x} cy={node.y} r={node.size} fill={node.color}
                    opacity={isActive ? 1 : 0.78}
                    style={{ transition: 'opacity 0.2s' }}
                  />
                  {isSelected && (
                    <text x={node.x} y={node.y + node.size + 15}
                      textAnchor="middle" fontSize={11} fontWeight={700}
                      fill={node.color} fillOpacity={0.95}
                    >
                      {node.maslow_value.length > 12 ? node.maslow_value.slice(0, 11) + '…' : node.maslow_value}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
          {tooltipNode && <NodeTooltip node={tooltipNode} svgW={SVG_W} />}
        </svg>

        <div className="px-5 py-3 border-t flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-white/50 uppercase tracking-wide">Холбоос:</span>
          {[
            { color: '#f87171', label: 'Аюултай' },
            { color: '#fb923c', label: 'Айдастай' },
            { color: '#94a3b8', label: 'Дунд' },
            { color: '#4ade80', label: 'Хөгжиж буй' },
            { color: '#60a5fa', label: 'Аз жаргал' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1">
              <svg width="16" height="6" style={{ display: 'block' }}>
                <line x1="0" y1="3" x2="16" y2="3" stroke={color} strokeWidth="2" />
              </svg>
              <span className="text-[10px] text-white/50">{label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 px-1">
        {nodes.map((node) => (
          <button
            key={node.id}
            onClick={() => setSelected(selected === node.id ? null : node.id)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all',
              selected === node.id
                ? 'font-semibold'
                : 'bg-white/8 text-white/70 hover:bg-white/15 hover:text-white',
            )}
            style={selected === node.id ? {
              backgroundColor: node.color + '22',
              color: node.color,
              outline: `1.5px solid ${node.color}55`,
            } : {}}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: node.color }} />
            {node.maslow_value}
          </button>
        ))}
      </div>

      {selectedNode && (
        <NodeDetail node={selectedNode} connectedEdges={selectedEdges}
          nodeMap={nodeMap} onClose={() => setSelected(null)}
          onSelectNode={(id) => setSelected(id)}
        />
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GraphPage() {
  const { token } = useAuth();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getValueGraph(token);
      setGraphData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Үнэт зүйлсийн граф</h1>
          <p className="text-sm text-white/50 mt-0.5">
            Дээр нь дарж дэлгэрэнгүй мэдээллийг харна уу
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-2"
          onClick={load}
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <RefreshCw size={13} />
          )}
          Шинэчлэх
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-white/50" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && !graphData && (
        <div className="flex flex-col items-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            <Network size={24} className="text-white/50/40" />
          </div>
          <p className="font-medium text-white/70">Граф байхгүй</p>
          <p className="text-sm text-white/50">
            Тэмдэглэл нэмснээр таны үнэт зүйлсийн граф бий болно
          </p>
        </div>
      )}

      {/* Graph */}
      {!loading && graphData && <GraphView data={graphData} />}
    </div>
  );
}