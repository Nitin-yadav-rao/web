"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin progress bar fixed to the top of the viewport, tracking scroll position. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[200] h-[2px] origin-left bg-accent"
    />
  );
}
