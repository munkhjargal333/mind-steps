// ─────────────────────────────────────────────────────────────────────────────
// types/domain/graph.ts
// Graph & Visualization domain types
// ─────────────────────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  label: string;
  [key: string]: unknown;
}

export interface GraphEdge {
  source: string;
  target: string;
  [key: string]: unknown;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  [key: string]: unknown;
}
