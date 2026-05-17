"use client";

import React from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal"; // Thành phần hiệu ứng xuất hiện (Reveal animation wrapper)
import { MagneticWrapper } from "@/components/ui/Magnetic"; // Thành phần tương tác nam châm (Magnetic interaction wrapper)
import Button from "@/components/ui/Button/Button";
import { promoBannerVariants, type PromoBannerTheme } from "./promo-banner.variants";

// Định nghĩa cấu trúc kiểu dữ liệu đầu vào nghiêm ngặt cho Component (Component properties strict interface definition)
interface PromoBannerProps {
  badge: string;            // Nội dung nhãn (Badge text content)
  title: string;            // Tiêu đề chính (Primary headline text)
  highlight: string;        // Từ khóa điểm nhấn nghệ thuật (Artistic core highlight text)
  description: string;      // Đoạn văn bản mô tả hệ thống (Description text copy)
  buttonText: string;       // Chữ hiển thị trên nút bấm (Action call-to-action button text)
  delay?: number;           // Thời gian trễ hiệu ứng chuyển động (Animation transition delay)
  theme?: PromoBannerTheme; // Tùy chọn giao diện màu sắc: "dark" | "emerald" | "sage" (Contextual layout theme option)
}

export const PromoBanner = ({
  badge,
  title,
  highlight,
  description,
  buttonText,
  delay = 0.9,
  theme = "sage", // Khởi tạo mặc định chạy tone màu Xanh Lá Xám - Sage Green (Default premium layout configuration)
}: PromoBannerProps) => {
  return (
    <Reveal delay={delay} className={promoBannerVariants.wrapper}>
      
      {/* 🟢 Khung Chứa Chính Chạy Biến Thể CVA (Main Responsive Container Block) */}
      <div className={promoBannerVariants.container({ theme })}>
        
        {/* 🟢 Quầng Sáng Chạy Ngầm Tương Thích Theo Môi Trường (Ambient Background Interactive Glow) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className={promoBannerVariants.glow[theme]}
        />

        {/* =========================================================
            KHỐI NỘI DUNG VĂN BẢN (Text Semantic Typography Block)
            ========================================================= */}
        <div className="z-10 text-center md:text-left mb-8 md:mb-0 relative max-w-2xl flex-grow">
          
          {/* Nhãn thể loại nhỏ phía trên (Top category context badge) */}
          <div className={promoBannerVariants.badge[theme]}>
            {badge}
          </div>
          
          {/* Tiêu đề phân cấp (Main interactive headline) */}
          <h3 className={promoBannerVariants.title[theme]}>
            {title}{" "}
            {/* Chữ điểm nhấn Gradient (Dynamic gradient text element) */}
            <span className={promoBannerVariants.highlight[theme]}>
              {highlight}
            </span>
          </h3>
          
          {/* Đoạn mô tả: Tự động map text-slate-500 mượt mà khi chạy theme sage (Fluid copy representation) */}
          <p className={promoBannerVariants.description[theme]}>
            {description}
          </p>
        </div>

        {/* =========================================================
            KHỐI NÚT HÀNH ĐỘNG CTA (Call-To-Action Interaction Block)
            ========================================================= */}
        <div className="z-10 flex-shrink-0 ml-0 md:ml-12 relative">
          <MagneticWrapper>
            <Button
              href="/register"
              size="lg"
              className={promoBannerVariants.button[theme]}
            >
              {buttonText}
            </Button>
          </MagneticWrapper>
        </div>

      </div>
    </Reveal>
  );
};