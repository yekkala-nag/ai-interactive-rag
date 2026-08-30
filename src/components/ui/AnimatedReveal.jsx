import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Animation primitives:
 *  - useInView(ref, { threshold, once }) — IntersectionObserver hook
 *  - Reveal — fades/slides children into view on scroll (stagger supported)
 *  - AnimatedNumber — count-up to a target value
 *  - prefersReducedMotion() — respects OS setting
 */

let arKeyframesInjected = false;
function ensureArKeyframes() {
  if (arKeyframesInjected || typeof document === "undefined") return;
  arKeyframesInjected = true;
  const style = document.createElement("style");
  style.id = "ar-keyframes";
  style.textContent = `
    @keyframes arFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes arRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes arLeft { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes arRight { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes arScale { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
    @keyframes arShimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
    @media (prefers-reduced-motion: reduce) {
      .ar-reduce * { animation: none !important; transition: none !important; }
    }
  `;
  document.head.appendChild(style);
}

export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useInView(options = {}) {
  const { threshold = 0.15, once = true, rootMargin = "0px 0px -10% 0px" } = options;
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once, rootMargin]);

  return [ref, inView];
}

const VARIANTS = {
  fade: "arFade",
  rise: "arRise",
  left: "arLeft",
  right: "arRight",
  scale: "arScale",
};

export function Reveal({
  children,
  variant = "rise",
  delay = 0,
  duration = 520,
  as: Tag = "div",
  reduceMotion,
  style,
  ...rest
}) {
  useEffect(() => ensureArKeyframes(), []);
  const [ref, inView] = useInView();
  const reduce = reduceMotion ?? prefersReducedMotion();
  const anim = VARIANTS[variant] || "arRise";

  return (
    <Tag
      ref={ref}
      className={reduce ? "ar-reduce" : undefined}
      style={{
        opacity: inView || reduce ? 1 : 0,
        animation: inView && !reduce ? `${anim} ${duration}ms cubic-bezier(0.2,0,0,1) ${delay}ms both` : "none",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function AnimatedNumber({
  value,
  duration = 900,
  decimals = 0,
  prefix = "",
  suffix = "",
  reduceMotion,
  style,
}) {
  const [display, setDisplay] = useState(reduceMotion ?? prefersReducedMotion() ? value : 0);
  const [ref, inView] = useInView();
  const reduce = reduceMotion ?? prefersReducedMotion();
  const startRef = useRef(0);
  const rafRef = useRef(null);

  const run = useCallback(() => {
    if (reduce) { setDisplay(value); return; }
    const start = performance.now();
    const from = startRef.current;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else startRef.current = value;
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [value, duration, reduce]);

  useEffect(() => {
    if (inView) run();
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return (
    <span ref={ref} style={style}>
      {prefix}
      {display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export function Shimmer({ height = 16, width = "100%", radius = 6, style }) {
  return (
    <div style={{
      height, width, borderRadius: radius,
      background: "linear-gradient(90deg, var(--ds-color-bg-surfaceHover) 25%, var(--ds-color-border-subtle) 37%, var(--ds-color-bg-surfaceHover) 63%)",
      backgroundSize: "936px 100%",
      animation: prefersReducedMotion() ? "none" : "arShimmer 1.4s ease infinite",
      ...style,
    }} />
  );
}
