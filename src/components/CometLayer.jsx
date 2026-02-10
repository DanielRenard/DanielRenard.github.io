import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function dist(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Cubic bezier point at t
function cubicPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

function quadPoint(p0, p1, p2, t) {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}


export default function CometLayer({ event, durationMs = 900, zIndex = 1 }) {
  const theme = useTheme();
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [visible, setVisible] = useState(false);
  const [head, setHead] = useState({ x: -9999, y: -9999 });
  const pathRef = useRef(null);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  // Derive a nice serpentine curve between start/end
  const curve = useMemo(() => {
  if (!event?.start || !event?.end) return null;

  const start = event.start;
  const end = event.end;

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const d = Math.hypot(dx, dy);

  // Arc height scales with distance, clamped so it stays tasteful
  const lift = clamp(d * 0.35, 120, 320);

  // Control point: halfway between start/end, lifted upward to create an arc
  const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  const ctrl = { x: mid.x, y: mid.y - lift };

  return { start, ctrl, end };
}, [event]);

const dPath = useMemo(() => {
  if (!curve) return "";
  const { start, ctrl, end } = curve;
  // ✅ Quadratic Bezier arc
  return `M ${start.x} ${start.y} Q ${ctrl.x} ${ctrl.y} ${end.x} ${end.y}`;
}, [curve]);

  useEffect(() => {
    if (!event || !curve) return;

    // kill prior anim
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (prefersReducedMotion) {
      // If reduced motion, just flash a tiny glow near the target
      setHead({ x: curve.end.x, y: curve.end.y });
      setVisible(true);
      timeoutRef.current = setTimeout(() => setVisible(false), 250);
      return;
    }

    setVisible(true);

    // Animate: draw path + move head along it
    const startTs = performance.now();
    const total = durationMs;

    // dash setup
    const pathEl = pathRef.current;
    let pathLen = 0;
    if (pathEl) {
      pathLen = pathEl.getTotalLength();
      pathEl.style.strokeDasharray = `${pathLen}`;
      pathEl.style.strokeDashoffset = `${pathLen}`;
    }

    const tick = (ts) => {
      const t = clamp((ts - startTs) / total, 0, 1);
      const eased = 1 - Math.pow(1 - t, 4); 


      // draw
      if (pathEl && pathLen) {
        pathEl.style.strokeDashoffset = `${(1 - eased) * pathLen}`;
        pathEl.style.opacity = `${1 - 0.15 * eased}`;
      }

      // head
     const p = quadPoint(curve.start, curve.ctrl, curve.end, eased);

      setHead(p);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // fade out after arrival
        timeoutRef.current = setTimeout(() => setVisible(false), 300);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [event, curve, durationMs, prefersReducedMotion]);

  const gradientId = "cometGradient";

  if (!visible || !curve) return null;

  return (
    <svg
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex,
      }}
      viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={theme.palette.primary.main} />
          <stop offset="100%" stopColor={theme.palette.secondary.main} />
        </linearGradient>

        <filter id="cometGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* main path */}
      <path
        ref={pathRef}
        d={dPath}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="4"
        strokeLinecap="round"
        style={{ opacity: 0.9 }}
      />

      {/* comet head */}
      <circle
        cx={head.x}
        cy={head.y}
        r="6"
        fill={`url(#${gradientId})`}
        filter="url(#cometGlow)"
        opacity="0.95"
      />
    </svg>
  );
}
