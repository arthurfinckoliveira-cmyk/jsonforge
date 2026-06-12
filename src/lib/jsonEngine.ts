/**
 * jsonEngine — pure domain logic for parsing, formatting and validating JSON.
 * No React, no DOM. Fully unit-testable.
 *
 * Requirements: FR-2 (format), FR-3 (validate + locate error), FR-4 (minify).
 */

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface ParseError {
  message: string;
  line: number;
  column: number;
  position: number;
}

export type ProcessResult =
  | { ok: true; parsed: JsonValue; formatted: string; minified: string }
  | { ok: false; error: ParseError };

/**
 * Convert a SyntaxError thrown by JSON.parse into a precise {line, column}.
 *
 * Modern V8 messages already include "line X column Y"; we use it when present.
 * Otherwise we fall back to computing line/column from the "position N" offset.
 */
export function locateError(input: string, err: SyntaxError): ParseError {
  const raw = err.message || 'Invalid JSON';

  const lineColMatch = /line (\d+) column (\d+)/i.exec(raw);
  const posMatch = /position (\d+)/i.exec(raw);
  const position = posMatch ? Number(posMatch[1]) : 0;

  let line: number;
  let column: number;

  if (lineColMatch) {
    line = Number(lineColMatch[1]);
    column = Number(lineColMatch[2]);
  } else {
    line = 1;
    column = 1;
    const upto = Math.min(position, input.length);
    for (let i = 0; i < upto; i++) {
      if (input[i] === '\n') {
        line += 1;
        column = 1;
      } else {
        column += 1;
      }
    }
  }

  // Strip the technical "in JSON at position N (...)" suffix for a cleaner message.
  const cleaned = raw.replace(/\s*in JSON at position[\s\S]*$/i, '').trim();

  return {
    message: cleaned.length > 0 ? cleaned : raw,
    line,
    column,
    position,
  };
}

/**
 * Parse + format + minify a JSON string.
 * @param input raw JSON text
 * @param indent number of spaces for pretty-print (2 or 4)
 */
export function processJson(input: string, indent = 2): ProcessResult {
  const trimmed = input.trim();

  if (trimmed === '') {
    return {
      ok: false,
      error: { message: 'Empty input', line: 1, column: 1, position: 0 },
    };
  }

  try {
    const parsed = JSON.parse(trimmed) as JsonValue;
    return {
      ok: true,
      parsed,
      formatted: JSON.stringify(parsed, null, indent),
      minified: JSON.stringify(parsed),
    };
  } catch (e) {
    return { ok: false, error: locateError(trimmed, e as SyntaxError) };
  }
}
