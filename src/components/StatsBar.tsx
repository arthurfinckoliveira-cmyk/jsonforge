import type { JsonStats } from '../lib/stats';

interface StatsBarProps {
  stats: JsonStats | null;
  valid: boolean;
  hasInput: boolean;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function StatsBar({ stats, valid, hasInput }: StatsBarProps) {
  if (!hasInput) {
    return (
      <div className="stats-bar idle">
        <span className="dot" /> Ready — paste JSON to begin
      </div>
    );
  }

  if (!valid || !stats) {
    return (
      <div className="stats-bar invalid">
        <span className="dot" /> Invalid JSON
      </div>
    );
  }

  return (
    <div className="stats-bar valid">
      <span className="dot" /> Valid
      <span className="sep">·</span> {stats.keys} keys
      <span className="sep">·</span> {stats.nodes} nodes
      <span className="sep">·</span> depth {stats.depth}
      <span className="sep">·</span> {formatBytes(stats.bytes)}
    </div>
  );
}
