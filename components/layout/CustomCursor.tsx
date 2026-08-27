"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ring-and-dot custom cursor: the dot tracks the pointer exactly, the ring
 * eases behind it and grows over interactive elements. Disabled on touch
 * devices and for visitors who prefer reduced motion — the system cursor
 * is left alone in both cases.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px)`;

      const near = (e.target as HTMLElement | null)?.closest?.("a, button, input, textarea, summary");
      const big = Boolean(near);
      if (ringRef.current) {
        ringRef.current.style.width = ringRef.current.style.height = big ? "52px" : "34px";
        ringRef.current.style.margin = big ? "-26px 0 0 -26px" : "-17px 0 0 -17px";
        ringRef.current.style.backgroundColor = big ? "var(--accentSoft)" : "transparent";
        ringRef.current.style.borderColor = big ? "var(--accent)" : "var(--line2)";
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    tick();

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 34,
          height: 34,
          margin: "-17px 0 0 -17px",
          border: "1px solid var(--line2)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transition:
            "width .25s cubic-bezier(.2,.8,.2,1), height .25s cubic-bezier(.2,.8,.2,1), margin .25s cubic-bezier(.2,.8,.2,1), background-color .25s ease, border-color .25s ease",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 4,
          height: 4,
          margin: "-2px 0 0 -2px",
          background: "var(--accent)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  );
}
