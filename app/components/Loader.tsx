"use client";

import { useEffect, useState } from "react";
import { signatureStrokes, signatureTotalLength, signatureViewBox } from "./signature-data";

const DRAW_MS = 2400;
const HOLD_MS = 350;
const FADE_MS = 700;

// Inline in <head> so a repeat visit hides the loader before first paint.
export const loaderBootScript = `try{if(sessionStorage.getItem("signature-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.loaded="1"}catch(e){document.documentElement.dataset.loaded="1"}`;

export function Loader() {
  const [state, setState] = useState<"drawing" | "leaving" | "done">("drawing");

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.loaded) {
      setState("done");
      return;
    }

    try {
      sessionStorage.setItem("signature-seen", "1");
    } catch {}

    const leave = setTimeout(() => {
      root.dataset.loaded = "1";
      window.dispatchEvent(new Event("loader:done"));
      setState("leaving");
    }, DRAW_MS + HOLD_MS);
    const finish = setTimeout(() => setState("done"), DRAW_MS + HOLD_MS + FADE_MS);

    return () => {
      clearTimeout(leave);
      clearTimeout(finish);
    };
  }, []);

  if (state === "done") return null;

  let drawn = 0;

  return (
    <div className={`loader ${state === "leaving" ? "is-leaving" : ""}`} role="status">
      <span className="sr-only">Loading Adithya R K Nambiar&apos;s portfolio</span>
      <svg viewBox={signatureViewBox} aria-hidden="true">
        {signatureStrokes.map((stroke, index) => {
          const delay = (drawn / signatureTotalLength) * DRAW_MS;
          drawn += stroke.length;
          return (
            <path
              key={index}
              d={stroke.d}
              pathLength={1}
              style={{
                animationDelay: `${delay}ms`,
                animationDuration: `${(stroke.length / signatureTotalLength) * DRAW_MS}ms`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
