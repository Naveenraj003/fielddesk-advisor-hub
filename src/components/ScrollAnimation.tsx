import { motion } from "framer-motion";
import { ReactNode } from "react";

export const FadeUp = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-gold mb-3">{children}</span>
);

export const SectionHeadline = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight ${className}`}>{children}</h2>
);
