"use client";

import { MotionConfig, motion } from "framer-motion";

/** Honours the visitor's reduced-motion preference for everything inside. */
export function Motion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Quiet scroll reveal – used for a few key blocks, not every element. */
export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Page-load entrance for the hero copy. */
export function Rise({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** A curve that plots itself the first time it scrolls into view. */
export function DrawPath({ d, stroke, width = 2, delay = 0, dash }: { d: string; stroke: string; width?: number; delay?: number; dash?: string }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dash}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ pathLength: { duration: 1.8, delay, ease: "easeInOut" }, opacity: { duration: 0.2, delay } }}
    />
  );
}

export function PopIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      {children}
    </motion.g>
  );
}
