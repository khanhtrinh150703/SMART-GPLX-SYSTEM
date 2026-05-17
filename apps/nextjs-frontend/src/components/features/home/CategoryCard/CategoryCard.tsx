"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion"; // Thành phần hiệu ứng từ Framer Motion (Animation components)
import { SpotlightCard } from "@/components/ui/Spotlight";
import {
  categoryCardVariants,
  type CategoryCardProps,
} from "./category-card.variants";
import { Reveal } from "@/components/ui/Reveal";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props extends CategoryCardProps {
  title: string;
  description: string;
  images: string[]; // Mảng danh sách ảnh (Image path array)
  badgeText: string;
  ribbonText?: string;
  delay?: number;
}

// Ép kiểu chuẩn cấu hình hiệu ứng trượt (Strict motion variants typing definition)
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.35 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.25 },
    },
  }),
};

// Cấu hình tính toán lực vuốt/kéo màn hình (Swipe threshold calculations configuration)
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const CategoryCard = ({
  title,
  description,
  images = [],
  badgeText,
  ribbonText,
  intent,
  delay = 0,
}: Props) => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [isHovered, setIsHovered] = useState<boolean>(false); // Trạng thái kiểm soát rê chuột (Hover state tracker)

  const activeIndex = ((page % images.length) + images.length) % images.length;

  // Hàm xử lý chuyển ảnh chủ động (Manual pagination handler)
  // 1. Dùng useCallback kết hợp dạng cập nhật hàm (Functional Update) để đóng băng định danh hàm
  const paginate = useCallback((newDirection: number) => {
    setPage((prev) => [prev[0] + newDirection, newDirection]);
  }, []); // 🟢 Mảng dependency rỗng giúp hàm không bao giờ bị khởi tạo lại

  // 2. Trình kích hoạt tự động chạy (Autoplay engine with stable references)
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 3200);

    return () => clearInterval(timer);
  }, [images.length, isHovered, paginate]); 

  return (
    <Reveal delay={delay} className="h-full">
      <SpotlightCard className={categoryCardVariants.container}>
        {/* 1. Ribbon điểm nhấn (Nếu có) */}
        {ribbonText && (
          <div className={categoryCardVariants.ribbon}>{ribbonText}</div>
        )}

        {/* 2. Badge tên hạng */}
        <div className={categoryCardVariants.badge({ intent })}>
          {badgeText}
        </div>

        {/* 3. Khu vực ảnh tích hợp ĐIỀU KHIỂN ĐA NĂNG (Interactive Sliding Showcase Container) */}
        <div
          className="relative h-56 w-full mb-6 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-50/50 group/image cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={() => setIsHovered(true)} // Kích hoạt tạm dừng khi đưa chuột vào (Trigger pause)
          onMouseLeave={() => setIsHovered(false)} // Chạy tiếp khi đưa chuột ra ngoài (Resume autoplay)
        >
          <div className={categoryCardVariants.glow({ intent })} />

          <div className="relative w-full h-full flex items-center justify-center p-6">
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                // 🟢 BỔ SUNG: Kéo/Vuốt ảnh vòng vòng (Drag & Swipe gesture configuration)
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1); // Vuốt sang trái -> xem ảnh kế tiếp
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1); // Vuốt sang phải -> xem ảnh trước đó
                  }
                }}
                className="absolute w-full h-full flex items-center justify-center px-8"
              >
                <Image
                  src={images[activeIndex]}
                  alt={`${title} view ${activeIndex + 1}`}
                  fill
                  sizes="(max-w-7xl) 33vw"
                  draggable={false} // Chống trình duyệt tự kéo ảnh thô (Disable native image ghost dragging)
                  className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out p-4 pointer-events-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* 🟢 BỔ SUNG: Nút bấm Trái/Phải điều hướng chủ động dùng SVG Lucide chuẩn tâm tuyệt đối (Pixel-perfect centered navigation arrows) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn chặn nổi bọt sự kiện lên thẻ cha (Stop event bubbling)
                  paginate(-1);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center border border-slate-200/60 shadow-sm opacity-0 group-hover/image:opacity-100 transition-all duration-300 hover:bg-white text-slate-700 active:scale-90"
                aria-label="Previous image"
              >
                {/* Thay thế ký tự text bằng Icon SVG để triệt tiêu lỗi lệch dòng font chữ */}
                <ChevronLeft size={16} className="stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center border border-slate-200/60 shadow-sm opacity-0 group-hover/image:opacity-100 transition-all duration-300 hover:bg-white text-slate-700 active:scale-90"
                aria-label="Next image"
              >
                {/* Thay thế ký tự text bằng Icon SVG để triệt tiêu lỗi lệch dòng font chữ */}
                <ChevronRight size={16} className="stroke-[2.5]" />
              </button>
            </>
          )}

          {/* Hệ thống thanh định vị (Navigation Dots Indicators) */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-slate-900/[0.05] backdrop-blur-md px-2.5 py-1 rounded-full border border-white/40 shadow-sm">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newDirection = index > activeIndex ? 1 : -1;
                    setPage([index, newDirection]);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-4 bg-emerald-500"
                      : "w-1.5 bg-slate-400/40 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 4. Khối thông tin văn bản */}
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500 leading-relaxed text-sm md:text-base">
            {description}
          </p>
        </div>
      </SpotlightCard>
    </Reveal>
  );
};
