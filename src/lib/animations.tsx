'use client';

/**
 * Reusable Framer Motion animation variants and components
 * for consistent, premium animations across FundVerse.
 */

import { motion, Variants } from 'framer-motion';
import React from 'react';

// ─── Variants ─────────────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Stagger container — children animate in sequence */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/** Faster stagger for tight grids */
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.02,
    },
  },
};

// ─── Scroll-triggered Section Wrapper ─────────────────────────────────────────

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'scaleIn';
}

const variantMap = { fadeUp, fadeIn, fadeLeft, fadeRight, scaleIn };

export function AnimateSection({
  children,
  className,
  delay = 0,
  variant = 'fadeUp',
}: SectionProps) {
  const selected = variantMap[variant];
  const withDelay: Variants = {
    hidden: selected.hidden,
    visible: {
      ...(selected.visible as object),
      transition: {
        ...((selected.visible as any).transition || {}),
        delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={withDelay}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger List Wrapper ──────────────────────────────────────────────────────

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  fast?: boolean;
}

export function StaggerList({ children, className, fast = false }: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fast ? staggerFast : staggerContainer}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Item (child of StaggerList) ──────────────────────────────────────

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

// ─── Page Entry Transition ────────────────────────────────────────────────────

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Hover Card Wrapper ───────────────────────────────────────────────────────

export function HoverCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
