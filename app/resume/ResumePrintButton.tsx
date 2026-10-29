"use client";

export function ResumePrintButton() {
  return (
    <button type="button" onClick={() => window.print()}>
      Print / save PDF ↗
    </button>
  );
}
