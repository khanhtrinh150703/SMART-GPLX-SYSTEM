"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

export const SmoothScrollProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: true, // Mở cái này nếu muốn mượt cả trên điện thoại
      }}
    >
      {children}
    </ReactLenis>
  );
};