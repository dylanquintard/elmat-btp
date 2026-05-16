"use client";

import type { ReactNode, CSSProperties } from "react";

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
};

export function RevealSection({ children, className, delay = 0, style }: RevealSectionProps) {
  return (
    <section
      className={className}
      style={{
        ...style,
        // Keep a subtle first paint animation without hiding server-rendered content.
        animation: `revealFadeUp 420ms ease-out ${Math.round(delay * 1000)}ms both`,
      }}
    >
      {children}
    </section>
  );
}
