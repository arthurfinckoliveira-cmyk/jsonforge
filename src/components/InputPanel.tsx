interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
  return (
    <section className="panel input-panel" aria-label="JSON input">
      <div className="panel-head">
        <span className="panel-title">Input</span>
        <span className="panel-meta">{value.length} chars</span>
      </div>
      <textarea
        className="code-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your JSON here…"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-label="JSON input text area"
      />
    </section>
  );
}
