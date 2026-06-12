import { useState } from 'react';

interface ToolbarProps {
  disabled: boolean;
  indent: number;
  onIndentChange: (n: number) => void;
  onFormat: () => void;
  onMinify: () => void;
  onSample: () => void;
  onClear: () => void;
  copyText: string;
}

export function Toolbar({
  disabled,
  indent,
  onIndentChange,
  onFormat,
  onMinify,
  onSample,
  onClear,
  copyText,
}: ToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard API unavailable — no-op */
    }
  };

  return (
    <div className="toolbar" role="toolbar" aria-label="JSON actions">
      <button
        className="btn btn-primary"
        onClick={onFormat}
        disabled={disabled}
        aria-label="Format JSON"
      >
        Format
      </button>
      <button className="btn" onClick={onMinify} disabled={disabled} aria-label="Minify JSON">
        Minify
      </button>
      <button
        className="btn"
        onClick={handleCopy}
        disabled={disabled}
        aria-label="Copy result to clipboard"
      >
        {copied ? 'Copied! ✓' : 'Copy'}
      </button>
      <button className="btn" onClick={onSample} aria-label="Load sample JSON">
        Sample
      </button>
      <button className="btn btn-ghost" onClick={onClear} aria-label="Clear input">
        Clear
      </button>
      <label className="indent-select">
        <span className="sr-only">Indentation size</span>
        <select
          value={indent}
          onChange={(e) => onIndentChange(Number(e.target.value))}
          aria-label="Indentation size"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
        </select>
      </label>
    </div>
  );
}
