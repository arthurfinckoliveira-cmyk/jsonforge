import { useState } from 'react';
import type { HistoryItem } from '../lib/history';

interface HistoryPanelProps {
  items: HistoryItem[];
  onLoad: (content: string) => void;
  onClear: () => void;
}

export function HistoryPanel({ items, onLoad, onClear }: HistoryPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="history">
      <button
        className="btn btn-ghost history-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Toggle history"
      >
        History ({items.length}) {open ? '▴' : '▾'}
      </button>
      {open && (
        <div className="history-dropdown">
          {items.length === 0 ? (
            <p className="empty-state small">No history yet.</p>
          ) : (
            <>
              <ul className="history-list">
                {items.map((it) => (
                  <li key={it.id}>
                    <button
                      className="history-item"
                      onClick={() => {
                        onLoad(it.content);
                        setOpen(false);
                      }}
                      title={it.content}
                    >
                      <span className="history-preview">{it.preview}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button className="btn btn-ghost danger" onClick={onClear} aria-label="Clear history">
                Clear history
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
