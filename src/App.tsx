import { useEffect, useMemo, useState } from 'react';
import type { ProcessResult } from './lib/jsonEngine';
import { processJson } from './lib/jsonEngine';
import { computeStats } from './lib/stats';
import type { HistoryItem } from './lib/history';
import { addHistory, clearHistory, loadHistory } from './lib/history';
import { Toolbar } from './components/Toolbar';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import type { OutputView } from './components/OutputPanel';
import { StatsBar } from './components/StatsBar';
import { ErrorBanner } from './components/ErrorBanner';
import { HistoryPanel } from './components/HistoryPanel';

const SAMPLE = `{
  "name": "Ada Lovelace",
  "born": 1815,
  "active": true,
  "skills": ["mathematics", "logic", "computing"],
  "address": { "city": "London", "country": "UK" },
  "notes": null
}`;

const DEBOUNCE_MS = 250;

export default function App() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);
  const [view, setView] = useState<OutputView>('tree');
  const [debounced, setDebounced] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory());

  // Debounce the raw input to keep the UI responsive on large payloads (NFR-2).
  useEffect(() => {
    const t = setTimeout(() => setDebounced(input), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [input]);

  const result = useMemo<ProcessResult | null>(() => {
    if (debounced.trim() === '') return null;
    return processJson(debounced, indent);
  }, [debounced, indent]);

  const isValid = result !== null && result.ok;
  const hasInput = debounced.trim() !== '';

  // Persist valid inputs to history (deduped + capped inside addHistory).
  useEffect(() => {
    if (result !== null && result.ok) {
      setHistory(addHistory(debounced));
    }
  }, [isValid, debounced, result]);

  const stats = useMemo(() => {
    if (result !== null && result.ok) return computeStats(result.parsed, result.minified);
    return null;
  }, [result]);

  const formatted = result !== null && result.ok ? result.formatted : '';
  const parsed = result !== null && result.ok ? result.parsed : undefined;

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            ⬢
          </span>
          <h1>JSONForge</h1>
          <span className="brand-tag">Formatter &amp; Validator</span>
        </div>
        <Toolbar
          disabled={!isValid}
          indent={indent}
          onIndentChange={setIndent}
          onFormat={() => {
            if (result !== null && result.ok) setInput(result.formatted);
          }}
          onMinify={() => {
            if (result !== null && result.ok) setInput(result.minified);
          }}
          onSample={() => setInput(SAMPLE)}
          onClear={() => setInput('')}
          copyText={formatted}
        />
      </header>

      {result !== null && !result.ok && hasInput && <ErrorBanner error={result.error} />}

      <main className="workspace">
        <InputPanel value={input} onChange={setInput} />
        <OutputPanel
          view={view}
          onViewChange={setView}
          formatted={formatted}
          parsed={parsed}
          valid={isValid}
        />
      </main>

      <footer className="app-footer">
        <StatsBar stats={stats} valid={isValid} hasInput={hasInput} />
        <span className="foot-note">100% client-side · your data never leaves the browser</span>
        <HistoryPanel
          items={history}
          onLoad={(content) => setInput(content)}
          onClear={() => setHistory(clearHistory())}
        />
      </footer>
    </div>
  );
}
