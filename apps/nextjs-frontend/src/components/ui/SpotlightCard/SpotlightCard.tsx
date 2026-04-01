"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Spotlight Card Component
 * (Thẻ hiển thị ánh sáng bám theo tọa độ chuột)
 */
export const SpotlightCard = ({ children, className }: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  /**
   * Calculate mouse position relative to the card
   * (Tính toán vị trí chuột tương đối so với thẻ)
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    // Lấy tọa độ X, Y bên trong thẻ
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -5 }} // Nâng nhẹ khi hover
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 backdrop-blur-sm transition-shadow duration-500 hover:shadow-2xl hover:shadow-emerald-500/10",
        className
      )}
    >
      {/* 🌟 Vệt sáng Spotlight (Spotlight overlay) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.08), transparent 40%)`,
        }}
      />
      
      {/* Nội dung thực tế nằm đè lên trên ánh sáng (Z-index cao hơn) */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};