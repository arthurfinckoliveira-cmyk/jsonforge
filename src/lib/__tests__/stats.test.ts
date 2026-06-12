import { describe, it, expect } from 'vitest';
import { computeStats } from '../stats';
import { processJson } from '../jsonEngine';

function statsFor(json: string) {
  const r = processJson(json, 2);
  if (!r.ok) throw new Error('expected valid JSON in test fixture');
  return computeStats(r.parsed, r.minified);
}

describe('computeStats', () => {
  it('counts keys, depth and bytes for a flat object', () => {
    const s = statsFor('{"a":1,"b":2,"c":3}');
    expect(s.keys).toBe(3);
    expect(s.depth).toBe(1);
    expect(s.bytes).toBe('{"a":1,"b":2,"c":3}'.length);
  });

  it('computes max depth for nested structures', () => {
    expect(statsFor('{"a":{"b":{"c":1}}}').depth).toBe(3);
    expect(statsFor('[[[1]]]').depth).toBe(3);
    expect(statsFor('1').depth).toBe(0);
  });

  it('counts array entries as nodes and reports zero keys', () => {
    const s = statsFor('[1,2,3]');
    expect(s.keys).toBe(0);
    expect(s.nodes).toBe(4); // the array itself + 3 numbers
  });
});
