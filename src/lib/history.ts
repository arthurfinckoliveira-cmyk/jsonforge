/**
 * history — localStorage-backed history of recent valid JSON inputs.
 * Requirements: FR-8 (keep last 10), FR-9 (clear), NFR-1 (client-only).
 * All access is wrapped in try/catch to survive private mode / quota errors.
 */

const STORAGE_KEY = 'jsonforge.history.v1';
const MAX_ITEMS = 10;
const PREVIEW_LEN = 60;

export interface HistoryItem {
  id: string;
  preview: string;
  content: string;
  ts: number;
}

function isHistoryItem(x: unknown): x is HistoryItem {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof (x as HistoryItem).id === 'string' &&
    typeof (x as HistoryItem).content === 'string'
  );
}

export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryItem).slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

export function addHistory(content: string): HistoryItem[] {
  const trimmed = content.trim();
  if (trimmed === '') return loadHistory();

  const existing = loadHistory().filter((it) => it.content !== trimmed);
  const preview = trimmed.replace(/\s+/g, ' ').slice(0, PREVIEW_LEN);
  const item: HistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    preview,
    content: trimmed,
    ts: Date.now(),
  };

  const next = [item, ...existing].slice(0, MAX_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota exceeded or private mode — degrade gracefully */
  }
  return next;
}

export function clearHistory(): HistoryItem[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return [];
}
