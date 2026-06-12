import { useState } from 'react';
import type { JsonValue } from '../lib/jsonEngine';

interface TreeNodeProps {
  name: string | number | null;
  value: JsonValue;
}

function typeOf(v: JsonValue): string {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v; // 'object' | 'string' | 'number' | 'boolean'
}

function Key({ name }: { name: string | number }) {
  return <span className="tk">{typeof name === 'number' ? name : `"${name}"`}</span>;
}

function ValueSpan({ value, type }: { value: JsonValue; type: string }) {
  let text: string;
  if (type === 'string') text = `"${value as string}"`;
  else if (type === 'null') text = 'null';
  else text = String(value);
  return <span className={`tv tv-${type}`}>{text}</span>;
}

export function TreeNode({ name, value }: TreeNodeProps) {
  const type = typeOf(value);
  const isContainer = type === 'object' || type === 'array';
  const [open, setOpen] = useState(true);

  if (!isContainer) {
    return (
      <li className="tree-node leaf">
        {name !== null && (
          <>
            <Key name={name} />
            <span className="colon">: </span>
          </>
        )}
        <ValueSpan value={value} type={type} />
      </li>
    );
  }

  const entries: Array<[string | number, JsonValue]> = Array.isArray(value)
    ? value.map((v, i) => [i, v] as [number, JsonValue])
    : Object.entries(value as Record<string, JsonValue>);

  const count = entries.length;
  const summary = type === 'array' ? `[${count}]` : `{${count}}`;

  return (
    <li className="tree-node branch">
      <button
        className="caret-btn"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={open ? 'caret open' : 'caret'} aria-hidden>
          ▸
        </span>
        {name !== null && (
          <>
            <Key name={name} />
            <span className="colon">: </span>
          </>
        )}
        <span className="container-summary">
          {type === 'array' ? 'array' : 'object'} {summary}
        </span>
      </button>
      {open && count > 0 && (
        <ul className="tree">
          {entries.map(([k, v]) => (
            <TreeNode key={String(k)} name={k} value={v} />
          ))}
        </ul>
      )}
    </li>
  );
}
