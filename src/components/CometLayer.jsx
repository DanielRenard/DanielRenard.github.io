import React, { useEffect, useMemo, useRef, useState } from "react";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function quadPoint(p0, p1, p2, t) {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

function quadTangent(p0, p1, p2, t) {
  return {
    x: 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x),
    y: 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y),
  };
}

function normalize(v) {
  const len = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / len, y: v.y / len };
}

function getTargetPoint(targetId) {
  const headerEl = document.getElementById(`${targetId}-title`);
  const sectionEl = document.getElementById(targetId);
  const el = headerEl ?? sectionEl;
  if (!el) return null;

  const r = el.getBoundingClientRect();
  // Top-left of the title box ≈ "the A"
  return { x: r.left, y: r.top + 6 };
}

function makeSparks(count = 12, seed = 1) {
  const sparks = [];
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const v = 70 + rand() * 140;
    const r0 = 2 + rand() * 3;
    sparks.push({ a, v, r0 });
  }
  return sparks;
}

export default function CometLayer({ event, durationMs = 900, zIndex = 2000 }) {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [head, setHead] = useState({ x: -9999, y: -9999 });
  const [behind, setBehind] = useState({ x: -1, y: 0 });
  const [currentD, setCurrentD] = useState("");
  const [boom, setBoom] = useState(null);
  const [vp, setVp] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1,
    h: typeof window !== "undefined" ? window.innerHeight : 1,
  }));

  const pathRef = useRef(null);
  const trailRef = useRef(null);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const gradientId = useMemo(
    () => `cometGradient-${event?.id ?? "default"}`,
    [event?.id]
  );
  const glowId = useMemo(
    () => `cometGlow-${event?.id ?? "default"}`,
    [event?.id]
  );

  useEffect(() => {
    if (!event?.start || !event?.targetId) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const endNow = getTargetPoint(event.targetId);
    if (!endNow) return;

    if (prefersReducedMotion) {
      // Show a static glow for longer on mobile
      setCurrentD(
        `M ${event.start.x} ${event.start.y} Q ${event.start.x} ${event.start.y} ${endNow.x} ${endNow.y}`
      );
      setHead(endNow);
      setBehind({ x: -1, y: 0 });
      setProgress(1);
      setVisible(true);
      timeoutRef.current = setTimeout(() => setVisible(false), 1200);
      return;
    }

    setVisible(true);
    setProgress(0);
    setBoom(null);

    const start = event.start;
    const startTs = performance.now();
    const total = durationMs;

    let dashReady = false;
    let pathLen = 0;

    const tick = (ts) => {
      const tRaw = (ts - startTs) / total;
      const t = clamp(tRaw, 0, 1);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart

      const end = getTargetPoint(event.targetId);
      if (!end) {
        setVisible(false);
        setProgress(0);
        return;
      }

      const d = Math.hypot(end.x - start.x, end.y - start.y);
      const lift = clamp(d * 0.35, 120, 320);
      const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
      const ctrl = { x: mid.x, y: mid.y - lift };

      const dPath = `M ${start.x} ${start.y} Q ${ctrl.x} ${ctrl.y} ${end.x} ${end.y}`;
      setCurrentD(dPath);

      const p = quadPoint(start, ctrl, end, eased);
      setHead(p);

      const tng = normalize(quadTangent(start, ctrl, end, eased));
      setBehind({ x: -tng.x, y: -tng.y });

      setProgress(eased);

      const pathEl = pathRef.current;
      const trailEl = trailRef.current;

      // Dash init — retry until length > 0 (mobile safety)
      if (!dashReady && pathEl) {
        const len = pathEl.getTotalLength();
        if (len > 0) {
          pathLen = len;

          pathEl.style.strokeDasharray = `${pathLen}`;
          pathEl.style.strokeDashoffset = `${pathLen}`;
          pathEl.style.opacity = "0.85";

          if (trailEl) {
            trailEl.style.strokeDasharray = `${pathLen}`;
            trailEl.style.strokeDashoffset = `${pathLen}`;
            trailEl.style.opacity = "0.28";
          }

          dashReady = true;
        }
      }

      if (dashReady && pathLen) {
        const off = (1 - eased) * pathLen;
        if (pathEl) pathEl.style.strokeDashoffset = `${off}`;
        if (trailEl) trailEl.style.strokeDashoffset = `${off}`;
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setHead(end);
        setProgress(1);

        setBoom({
          x: end.x,
          y: end.y,
          seed: Date.now() % 100000,
          startTs: performance.now(),
        });

        timeoutRef.current = setTimeout(() => {
          setVisible(false);
          setProgress(0);
          setBoom(null);
        }, 520);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [event, durationMs, prefersReducedMotion]);

  if (!visible) return null;

  const safe = (n) => (Number.isFinite(n) ? n : -9999);

  const tail1 = {
    x: safe(head.x + behind.x * 18),
    y: safe(head.y + behind.y * 18),
  };
  const tail2 = {
    x: safe(head.x + behind.x * 36),
    y: safe(head.y + behind.y * 36),
  };

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
      viewBox={`0 0 ${vp.w} ${vp.h}`}
      preserveAspectRatio="none"
    >
      <defs>
        {/* gold trail gradient */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="35%" stopColor="#FFD36A" />
          <stop offset="70%" stopColor="#FFB02E" />
          <stop offset="100%" stopColor="#FF7A18" />
        </linearGradient>

        {/* fiery head */}
        <radialGradient id={`${gradientId}-head`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="25%" stopColor="#FFF6C7" stopOpacity="0.98" />
          <stop offset="55%" stopColor="#FFCC55" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#FF9A1F" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FF6A00" stopOpacity="0" />
        </radialGradient>

        <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 18 -6"
            result="boost"
          />
          <feMerge>
            <feMergeNode in="boost" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* soft glowing trail */}
      <path
        ref={trailRef}
        d={currentD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.28"
        filter={`url(#${glowId})`}
      />

      {/* main trail */}
      <path
        ref={pathRef}
        d={currentD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* tail blobs */}
      <circle
        cx={tail2.x}
        cy={tail2.y}
        r={16}
        fill="#FFB02E"
        opacity={0.24}
        filter={`url(#${glowId})`}
      />
      <circle
        cx={tail1.x}
        cy={tail1.y}
        r={12}
        fill="#FFD36A"
        opacity={0.38}
        filter={`url(#${glowId})`}
      />

      {/* halo */}
      <circle
        cx={head.x}
        cy={head.y}
        r={22 + 10 * progress}
        fill={`url(#${gradientId}-head)`}
        opacity={0.18 + 0.26 * progress}
        filter={`url(#${glowId})`}
      />

      {/* core */}
      <circle
        cx={head.x}
        cy={head.y}
        r={7 + 2 * progress}
        fill="#FFFFFF"
        opacity="0.95"
      />

      {/* shell */}
      <circle
        cx={head.x}
        cy={head.y}
        r={12 + 4 * progress}
        fill={`url(#${gradientId}-head)`}
        opacity="0.88"
        filter={`url(#${glowId})`}
      />

      {boom ? <ExplosionBurst boom={boom} gradientId={gradientId} glowId={glowId} /> : null}
    </svg>
  );
}

function ExplosionBurst({ boom, gradientId, glowId }) {
  const [t, setT] = useState(0);
  const raf = useRef(null);

  const sparks = useMemo(() => makeSparks(14, boom.seed), [boom.seed]);

  useEffect(() => {
    const D = 420;
    const tick = (now) => {
      const p = clamp((now - boom.startTs) / D, 0, 1);
      setT(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [boom.startTs]);

  const eased = 1 - Math.pow(1 - t, 3);
  const fade = 1 - t;

  return (
    <g opacity={0.95}>
      <circle
        cx={boom.x}
        cy={boom.y}
        r={10 + 22 * eased}
        fill={`url(#${gradientId})`}
        opacity={0.35 * fade}
        filter={`url(#${glowId})`}
      />
      {sparks.map((s, i) => {
        const d = s.v * eased;
        const x = boom.x + Math.cos(s.a) * d;
        const y = boom.y + Math.sin(s.a) * d;
        const r = s.r0 + 2 * (1 - fade);

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={`url(#${gradientId})`}
            opacity={0.75 * fade}
            filter={`url(#${glowId})`}
          />
        );
      })}
    </g>
  );
}
