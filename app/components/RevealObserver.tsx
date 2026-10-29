"use client";

import { useEffect } from "react";

export function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    // Hold reveals until the signature loader hands over, so the hero
    // headline animates in view rather than behind the loader.
    const start = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((target) => observer.observe(target));
    };

    if (document.documentElement.dataset.loaded) start();
    else window.addEventListener("loader:done", start, { once: true });

    return () => {
      window.removeEventListener("loader:done", start);
      observer.disconnect();
    };
  }, []);

  return null;
}
