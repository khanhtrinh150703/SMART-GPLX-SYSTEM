"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils/utils";
import { revealVariants, type RevealVariants } from "./reveal.variants";
import { usePathname } from "next/navigation";

export interface RevealComponentProps extends RevealVariants {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export const Reveal = ({
  children,
  delay = 0,
  direction = "up",
  className,
}: RevealComponentProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    // 💡 SENIOR TRICK: Đưa việc set state vào cuối hàng chờ thực thi
    // Điều này giúp tránh lỗi "Cascading Renders" vì React đã hoàn tất render pass hiện tại.
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer); // Dọn dẹp bộ nhớ
  }, [pathname]);

  const motionVariants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
      x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  // PHAO CỨU SINH: Nếu chưa mount hoặc có vấn đề, trả về nội dung thuần
  // để ít nhất người dùng vẫn thấy được chữ/hình (không bị trắng trang)
  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      // 💡 MẸO: initial={false} sẽ bỏ qua animation lần đầu nếu cần,
      // nhưng ở đây ta giữ "hidden" để có hiệu ứng mượt.
      key={`${pathname}-${delay}-${direction}`}
      initial="hidden"
      whileInView="visible"
      // Giảm amount xuống 0.1 để nhạy hơn, dễ kích hoạt hơn
      viewport={{ once: true, margin: "0px 0px -20px 0px", amount: 0, }}
      variants={motionVariants}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      // FIX LỖI CVA: className nên để ra ngoài object variants
      className={cn(revealVariants({ direction }), className)}
    >
      {children}
    </motion.div>
  );
};
