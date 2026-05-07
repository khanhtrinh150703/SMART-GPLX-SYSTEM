"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/utils";
import { ActionMotionProps } from "./action-motion.types";
import { VARIANT_CONFIG } from "./action-motion.constants";
import {
  buttonTapVariants,
  veilVariants,
  originalTextVariants,
  whiteTextVariants,
  buttonSizeVariants,
  iconContainerSizes,
  iconVariants,
} from "./action-motion.variants";

export default function ActionMotion({
  onClick,
  isLoading = false,
  icon,
  label,
  className,
  variant = "emerald",
  size = "md",
}: ActionMotionProps) {
  const config = VARIANT_CONFIG[variant];
  const [mounted, setMounted] = useState(false);
  const iconSizeClass = iconContainerSizes[size];

  // Calculate dynamic slide distance (Tính toán khoảng cách trượt động)
  const getIconSlide = () => {
    switch (size) {
      case "sm":
        return "calc(100% - 36px)";
      case "lg":
        return "calc(100% - 48px)";
      case "xl":
        return "calc(100% - 56px)";
      default:
        return "calc(100% - 44px)"; // md
    }
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const baseButtonClass = cn(
    buttonSizeVariants({ size }),
    config.base,
    config.active,
    className,
  );

  if (!mounted) return <button className={baseButtonClass}>{label}</button>;

  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      variants={buttonTapVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={baseButtonClass}
    >
      <motion.div
        variants={veilVariants}
        className={cn(
          "absolute inset-y-0 left-0 z-10 rounded-full",
          config.veil,
        )}
      />
      {/* Text Layer: Căn giữa tuyệt đối (Absolute Center) */}
      <div className="relative z-20 flex-1 flex items-center justify-center pointer-events-none px-10">
        <div className="relative flex items-center justify-center">
          <motion.span
            variants={originalTextVariants}
            className="uppercase font-black tracking-widest whitespace-nowrap"
          >
            {label}
          </motion.span>
          <motion.span
            variants={whiteTextVariants}
            className="absolute uppercase font-black tracking-widest whitespace-nowrap text-white"
          >
            {label}
          </motion.span>
        </div>
      </div>
      {/* LAYER NGOÀI: CHỈ LO VIỆC TRƯỢT VÀ LĂN KHI HOVER */}
      <motion.div
        custom={getIconSlide()}
        variants={iconVariants}
        className={cn(
          "absolute flex items-center justify-center rounded-full z-30",
          iconSizeClass,
          config.iconContainer,
        )}
      >
        {/* LAYER TRONG: CHỈ XOAY KHI LOADING (INNER LAYER: ROTATE ONLY ON LOADING) */}
        <motion.div
          animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
          transition={
            isLoading
              ? { repeat: Infinity, duration: 1, ease: "linear" }
              : { duration: 0 } // Reset ngay lập tức (Immediate reset)
          }
          className="flex items-center justify-center w-full h-full"
        >
          {icon}
        </motion.div>
      </motion.div>
      {/* Loading Overlay (Lớp phủ khi đang tải) */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 rounded-full bg-black/5 backdrop-blur-[0.5px] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
