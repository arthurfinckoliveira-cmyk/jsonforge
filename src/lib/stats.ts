/**
 * stats — pure functions to compute structural statistics of a parsed JSON value.
 * Requirement: FR-7 (keys, depth, bytes).
 */
import type { JsonValue } from './jsonEngine';

export interface JsonStats {
  /** total object keys across all levels */
  keys: number;
  /** total values visited (containers + leaves) */
  nodes: number;
  /** deepest container nesting (scalar root = 0, {..} = 1, {{..}} = 2) */
  depth: number;
  /** byte length of the minified representation */
  bytes: number;
}

export function computeStats(value: JsonValue, minified: string): JsonStats {
  let keys = 0;
  let nodes = 0;
  let depth = 0;

  function walk(v: JsonValue, containerDepth: number): void {
    nodes += 1;

    if (Array.isArray(v)) {
      const d = containerDepth + 1;
      if (d > depth) depth = d;
      for (const item of v) walk(item, d);
    } else if (v !== null && typeof v === 'object') {
      const d = containerDepth + 1;
      if (d > depth) depth = d;
      const record = v as Record<string, JsonValue>;
      for (const key of Object.keys(record)) {
        keys += 1;
        walk(record[key], d);
      }
    }
  }

  walk(value, 0);

  const bytes = new TextEncoder().encode(minified).length;
  return { keys, nodes, depth, bytes };
}
