"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeroFrameProps = {
  eyebrow?: ReactNode;
  heading: ReactNode;
  lead?: ReactNode;
  ctas?: ReactNode;
  trust?: ReactNode;
  aside?: ReactNode;
  className?: string;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HeroFrame({
  eyebrow,
  heading,
  lead,
  ctas,
  trust,
  aside,
  className,
}: HeroFrameProps) {
  return (
    <div
      className={cn(
        "relative grid gap-12 md:gap-16 items-center",
        aside ? "md:grid-cols-2" : "md:grid-cols-1",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-7"
          >
            {eyebrow}
          </motion.div>
        ) : null}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="mb-6"
        >
          {heading}
        </motion.div>
        {lead ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            className="mb-10 max-w-xl"
          >
            {lead}
          </motion.div>
        ) : null}
        {ctas ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {ctas}
          </motion.div>
        ) : null}
        {trust ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
            className="mt-12"
          >
            {trust}
          </motion.div>
        ) : null}
      </div>
      {aside ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="relative"
        >
          {aside}
        </motion.div>
      ) : null}
    </div>
  );
}
