"use client";

import { useCallback, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

type Point = { x: number; y: number };

const WIDTH = 600;
const HEIGHT = 720;
const SAMPLES = 260;
const ANCHOR: Point = { x: 400, y: 0 };
const REST: Point = { x: 330, y: 650 };
const MAX_PULL = 320;
const KEY_DIRECTION: Point = { x: -0.24, y: 0.97 };

const smoothstep = (from: number, to: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - from) / (to - from)));
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// A few drifting loops of varying radius read as a hand-tangled thread.
function loopPoint(t: number): Point {
  const theta = t * Math.PI * 2 * 3.25;
  const radius = 210 * (0.62 + 0.38 * Math.sin(2.4 * theta + 0.6));
  return {
    x: 300 + 40 * Math.sin(1.7 * theta) + radius * Math.cos(theta),
    y: 330 + 30 * Math.cos(1.1 * theta) + radius * 0.82 * Math.sin(theta),
  };
}

// The tangle's end is pinned to the resting handle. Its start is replaced by
// a curve that leaves the anchor heading straight down (the direction the
// page thread arrives from) and joins the loop along its own tangent, so the
// thread and the knot read as one unbroken line.
const KNOT: Point[] = (() => {
  const last = loopPoint(1);
  const tangle = Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const t = i / SAMPLES;
    const point = loopPoint(t);
    const tail = smoothstep(0.86, 1, t);
    return { x: point.x + tail * (REST.x - last.x), y: point.y + tail * (REST.y - last.y) };
  });

  const join = Math.round(SAMPLES * 0.1);
  const meet = tangle[join];
  const along = { x: tangle[join + 1].x - tangle[join - 1].x, y: tangle[join + 1].y - tangle[join - 1].y };
  const scale = 130 / Math.hypot(along.x, along.y);
  const c1 = { x: ANCHOR.x, y: ANCHOR.y + 130 };
  const c2 = { x: meet.x - along.x * scale, y: meet.y - along.y * scale };
  const lead = Array.from({ length: join }, (_, i) => {
    const t = i / join;
    const u = 1 - t;
    return {
      x: u * u * u * ANCHOR.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * meet.x,
      y: u * u * u * ANCHOR.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * meet.y,
    };
  });

  return [...lead, ...tangle.slice(join)];
})();
const LAST = KNOT.length - 1;
const OPEN_AT = 0.5;

function toPath(points: Point[]) {
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(points[0].x)} ${f(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d += `C${f(p1.x + (p2.x - p0.x) / 6)} ${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)} ${f(p2.y - (p3.y - p1.y) / 6)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
}

function threadPath(handle: Point) {
  const pull = Math.min(1, Math.hypot(handle.x - REST.x, handle.y - REST.y) / MAX_PULL);
  const ease = 1 - (1 - pull) ** 3;
  const offset = { x: handle.x - REST.x, y: handle.y - REST.y };
  const points = KNOT.map((point, i) => {
    const t = i / LAST;
    const stretch = t * t;
    const tangled = { x: point.x + offset.x * stretch, y: point.y + offset.y * stretch };
    const straight = { x: lerp(ANCHOR.x, handle.x, t), y: lerp(ANCHOR.y, handle.y, t) };
    return { x: lerp(tangled.x, straight.x, ease), y: lerp(tangled.y, straight.y, ease) };
  });
  return { d: toPath(points), pull };
}

export function Knot() {
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef(0);
  const [handle, setHandle] = useState<Point>(REST);
  const [dragging, setDragging] = useState(false);
  const { d, pull } = useMemo(() => threadPath(handle), [handle]);

  const toSvg = (event: PointerEvent) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return REST;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: point.x, y: point.y };
  };

  const springBack = useCallback((from: Point) => {
    cancelAnimationFrame(frameRef.current);
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      // easeOutBack overshoots slightly, like a released string.
      const k = 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
      setHandle({ x: lerp(from.x, REST.x, k), y: lerp(from.y, REST.y, k) });
      frameRef.current = t < 1 ? requestAnimationFrame(step) : 0;
    };
    frameRef.current = requestAnimationFrame(step);
  }, []);

  const gestureRef = useRef({ maxPull: 0 });

  const openTalk = () => window.dispatchEvent(new Event("talk:open"));

  const onPointerDown = (event: PointerEvent<SVGGElement>) => {
    cancelAnimationFrame(frameRef.current);
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = toSvg(event);
    gestureRef.current = { maxPull: 0 };
    setDragging(true);
    setHandle(point);
  };

  const onPointerMove = (event: PointerEvent<SVGGElement>) => {
    if (!dragging) return;
    const point = toSvg(event);
    const gesture = gestureRef.current;
    gesture.maxPull = Math.max(gesture.maxPull, threadPath(point).pull);
    setHandle(point);
  };

  // Only a real pull opens the "Let's talk" dialog; a tap or a short tug just
  // springs the thread back.
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (gestureRef.current.maxPull >= OPEN_AT) openTalk();
    springBack(handle);
  };

  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    const delta = { ArrowDown: 0.1, ArrowRight: 0.1, ArrowUp: -0.1, ArrowLeft: -0.1, Home: -1, End: 1 }[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    cancelAnimationFrame(frameRef.current);
    const nextPull = Math.min(1, Math.max(0, pull + delta));
    if (nextPull >= 1) {
      openTalk();
      springBack({ x: REST.x + KEY_DIRECTION.x * MAX_PULL, y: REST.y + KEY_DIRECTION.y * MAX_PULL });
      return;
    }
    setHandle({ x: REST.x + KEY_DIRECTION.x * nextPull * MAX_PULL, y: REST.y + KEY_DIRECTION.y * nextPull * MAX_PULL });
  };

  const ready = dragging && pull >= OPEN_AT;

  return (
    // The wrapper's class list is owned by RevealObserver (is-visible), so
    // drag state lives on the svg to keep React from overwriting it.
    <div className="knot" data-reveal>
      <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={dragging ? "is-dragging" : undefined}>
        {/* Marks where the page thread must end; measured in rendered pixels,
            so it stays exact however the svg is scaled or centred. */}
        <circle className="knot-anchor" data-thread-anchor cx={ANCHOR.x} cy={ANCHOR.y} r="1" />
        <path className="knot-thread" d={d} pathLength={1} />
        <g
          className="knot-handle"
          transform={`translate(${handle.x} ${handle.y})`}
          role="slider"
          tabIndex={0}
          aria-label="Pull to untangle the thread and open the contact form"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pull * 100)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          onBlur={() => pull > 0 && !dragging && !frameRef.current && springBack(handle)}
        >
          <circle className="knot-hit" r="34" />
          <circle className="knot-ring" r="13" />
          <circle className="knot-dot" r="5" />
        </g>
        {ready ? (
          <text className="knot-label is-ready" x={handle.x} y={handle.y + 52} textAnchor="middle">
            Let go to talk ↗
          </text>
        ) : (
          <text className={`knot-label ${pull > 0.04 ? "is-hidden" : ""}`} x={REST.x} y={REST.y + 52} textAnchor="middle">
            Pull to untangle
          </text>
        )}
      </svg>
    </div>
  );
}
