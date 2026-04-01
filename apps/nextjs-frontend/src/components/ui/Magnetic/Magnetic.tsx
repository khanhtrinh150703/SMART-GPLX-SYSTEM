"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Magnetic Wrapper: Hiệu ứng nam châm cho các thành phần tương tác
 */
export const MagneticWrapper = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    // Tính toán khoảng cách từ tâm (Distance from center)
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    // Cường độ hút (Strength factor) - 0.35 là mức vừa phải
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 }); // Trả về vị trí cũ khi chuột rời đi
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ 
        type: "spring", 
        stiffness: 150, 
        damping: 15, 
        mass: 0.1 
      }}
      className="inline-block" // Đảm bảo wrapper ôm khít nội dung
    >
      {children}
    </motion.div>
  );
};