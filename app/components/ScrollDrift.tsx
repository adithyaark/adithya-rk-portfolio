"use client";

import { useEffect } from "react";

const SPEED = 0.32;
const EASE = 0.12;

// Slides every [data-drift] element sideways as its section scrolls past the
// middle of the viewport. data-drift="1" moves right on the way down, "-1"
// left; lines sit in their resting place while their section is centred.
export function ScrollDrift() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-drift]")).map((element) => ({
      element,
      direction: Number(element.dataset.drift) || 1,
      section: element.closest("section") ?? element,
      current: 0,
    }));
    let frame = 0;

    const tick = () => {
      const centre = window.innerHeight / 2;
      let moving = false;
      for (const item of items) {
        const box = item.section.getBoundingClientRect();
        const target = item.direction * SPEED * (centre - (box.top + box.height / 2));
        item.current += (target - item.current) * EASE;
        if (Math.abs(target - item.current) > 0.1) moving = true;
        else item.current = target;
        item.element.style.transform = `translate3d(${item.current.toFixed(2)}px, 0, 0)`;
      }
      frame = moving ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    start();
    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", start);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", start);
    };
  }, []);

  return null;
}
