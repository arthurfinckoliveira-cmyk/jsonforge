import type { ParseError } from '../lib/jsonEngine';

interface ErrorBannerProps {
  error: ParseError;
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <span className="error-icon" aria-hidden>
        ✕
      </span>
      <span className="error-text">
        Invalid JSON — {error.message}
        <span className="error-loc">
          {' '}
          (line {error.line}, column {error.column})
        </span>
      </span>
    </div>
  );
}
