/**
 * Insights Feature Types
 */

export interface SeedInsightData {
  mirror: string;
  reframe: string;
  relief: string;
  summary: string;
}

export interface GraphData {
  nodes: { id: string; label: string; [key: string]: unknown }[];
  edges: { source: string; target: string; [key: string]: unknown }[];
  [key: string]: unknown;
}

export interface DeepInsight {
  id: string;
  content: string;
  created_at: string;
  [key: string]: unknown;
}
