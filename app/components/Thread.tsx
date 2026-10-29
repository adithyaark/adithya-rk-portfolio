"use client";

import { useEffect, useRef, useState } from "react";

type Sample = { length: number; y: number };

// Builds one continuous path: a loose knot in the hero, then a line that
// weaves between page edges, touching the middle of every [data-thread] section.
function buildPath(width: number) {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-thread]"));
  const hero = sections[0];
  if (!hero) return "";

  const heroBottom = hero.offsetTop + hero.offsetHeight;
  const x0 = width * 0.7;
  const y0 = hero.offsetTop + hero.offsetHeight * 0.32;
  const loop = Math.min(width * 0.16, 190);

  let d = `M ${width * 1.02} ${y0 - loop * 0.4}`;
  d += ` C ${width * 0.9} ${y0 - loop * 0.6}, ${x0 + loop} ${y0 - loop * 0.9}, ${x0} ${y0}`;
  d += ` C ${x0 - loop * 1.1} ${y0 + loop * 1.2}, ${x0 + loop * 1.4} ${y0 + loop * 1.3}, ${x0 + loop * 0.4} ${y0 - loop * 0.2}`;
  d += ` C ${x0 - loop * 0.3} ${y0 - loop * 1.1}, ${x0 - loop * 1.6} ${y0 + loop * 0.2}, ${width * 0.5} ${heroBottom - 40}`;

  let prevX = width * 0.5;
  let prevY = heroBottom - 40;

  sections.slice(1).forEach((section, index) => {
    // A section can name the exact point the thread should run into.
    const anchor = section.querySelector<Element>("[data-thread-anchor]")?.getBoundingClientRect();
    const x = anchor ? anchor.left + anchor.width / 2 + window.scrollX : index % 2 === 0 ? width * 0.07 : width * 0.93;
    const y = anchor ? anchor.top + anchor.height / 2 + window.scrollY : section.offsetTop + section.offsetHeight * 0.5;
    const pull = (y - prevY) * 0.5;
    d += ` C ${prevX} ${prevY + pull}, ${x} ${y - pull}, ${x} ${y}`;
    prevX = x;
    prevY = y;
  });

  return d;
}

export function Thread() {
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0, d: "" });

  useEffect(() => {
    const measure = () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.scrollHeight;
      setSize({ width, height, d: buildPath(width) });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const head = headRef.current;
    if (!path || !head || !size.d) return;

    const total = path.getTotalLength();
    const samples: Sample[] = [];
    for (let i = 0; i <= 400; i++) {
      const length = (total * i) / 400;
      samples.push({ length, y: path.getPointAtLength(length).y });
    }
    const knotEnd = samples[Math.round(samples.length * 0.12)].length;

    path.style.strokeDasharray = `${total}`;
    let frame = 0;

    const update = () => {
      frame = 0;
      const target = window.scrollY + window.innerHeight * 0.62;
      let drawn = knotEnd;
      for (const sample of samples) {
        if (sample.y <= target) drawn = Math.max(drawn, sample.length);
      }
      path.style.strokeDashoffset = `${total - drawn}`;
      const point = path.getPointAtLength(drawn);
      head.setAttribute("transform", `translate(${point.x} ${point.y})`);
      // Once the thread reaches its end, the contact knot takes over drawing.
      document.documentElement.toggleAttribute("data-thread-done", drawn >= total - 2);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [size]);

  if (!size.d) return null;

  return (
    <svg
      className="thread-layer"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      aria-hidden="true"
    >
      <path ref={pathRef} d={size.d} className="thread-path" />
      <g ref={headRef} className="thread-head">
        <circle r="11" className="thread-head-ring" />
        <circle r="4.5" />
      </g>
    </svg>
  );
}
