import type { JsonValue } from '../lib/jsonEngine';
import { TreeView } from './TreeView';

export type OutputView = 'tree' | 'raw';

interface OutputPanelProps {
  view: OutputView;
  onViewChange: (view: OutputView) => void;
  formatted: string;
  parsed?: JsonValue;
  valid: boolean;
}

export function OutputPanel({ view, onViewChange, formatted, parsed, valid }: OutputPanelProps) {
  return (
    <section className="panel output-panel" aria-label="Formatted output">
      <div className="panel-head">
        <span className="panel-title">Output</span>
        <div className="segmented" role="tablist" aria-label="Output view">
          <button
            role="tab"
            aria-selected={view === 'tree'}
            className={view === 'tree' ? 'seg active' : 'seg'}
            onClick={() => onViewChange('tree')}
          >
            Tree
          </button>
          <button
            role="tab"
            aria-selected={view === 'raw'}
            className={view === 'raw' ? 'seg active' : 'seg'}
            onClick={() => onViewChange('raw')}
          >
            Raw
          </button>
        </div>
      </div>
      <div className="output-body">
        {!valid || parsed === undefined ? (
          <p className="empty-state">Formatted output will appear here.</p>
        ) : view === 'raw' ? (
          <pre className="code-area output-pre">{formatted}</pre>
        ) : (
          <TreeView value={parsed} />
        )}
      </div>
    </section>
  );
}
