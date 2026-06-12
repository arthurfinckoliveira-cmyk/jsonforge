import { describe, it, expect } from 'vitest';
import { processJson, locateError } from '../jsonEngine';

describe('processJson', () => {
  it('formats valid JSON with 2-space indent', () => {
    const r = processJson('{"a":1,"b":[1,2]}', 2);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.formatted).toContain('\n  "a": 1');
      expect(r.minified).toBe('{"a":1,"b":[1,2]}');
    }
  });

  it('respects 4-space indent', () => {
    const r = processJson('{"a":1}', 4);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.formatted).toContain('\n    "a": 1');
  });

  it('returns an error for empty / whitespace input', () => {
    const r = processJson('   ', 2);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.message).toMatch(/empty/i);
  });

  it('returns an error with a line/column for invalid JSON', () => {
    const r = processJson('{\n  "a": 1\n  "b": 2\n}', 2);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.line).toBeGreaterThanOrEqual(1);
      expect(typeof r.error.column).toBe('number');
      expect(r.error.message.length).toBeGreaterThan(0);
    }
  });

  it('parses primitives, arrays and deeply nested objects', () => {
    expect(processJson('true', 2).ok).toBe(true);
    expect(processJson('[1,2,3]', 2).ok).toBe(true);
    expect(processJson('{"x":{"y":{"z":1}}}', 2).ok).toBe(true);
  });
});

describe('locateError fallback (position -> line/column)', () => {
  it('computes line/column from position when the message lacks line info', () => {
    const input = '{\n"a": @ }';
    const err = new SyntaxError('Unexpected token @ in JSON at position 7');
    const located = locateError(input, err);
    expect(located.line).toBe(2);
    expect(located.column).toBe(6);
    expect(located.position).toBe(7);
    expect(located.message).toBe('Unexpected token @');
  });
});
