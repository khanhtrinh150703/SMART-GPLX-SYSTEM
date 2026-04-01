"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { spotlightVariants } from "./spotlight.variants";
import { cn } from "@/lib/utils/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export const SpotlightCard = ({ children, className }: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  /**
   * Handle Mouse Move: Calculate coordinates relative to the card 
   * (Xử lý di chuyển chuột: Tính toán tọa độ tương đối so với thẻ)
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    // Tính toán vị trí X, Y bên trong Card
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)} // Hiện vệt sáng khi chuột vào
      onMouseLeave={() => setOpacity(0)} // Ẩn vệt sáng khi chuột ra
      whileHover={{ y: -8 }} // Hiệu ứng nâng nhẹ (Lifting effect)
      className={cn(spotlightVariants(), className)}
    >
      {/* 🌟 Spotlight Layer (Lớp ánh sáng quét theo chuột) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.1), transparent 40%)`,
        }}
      />
      
      {/* Nội dung bên trong (Content layer) */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};