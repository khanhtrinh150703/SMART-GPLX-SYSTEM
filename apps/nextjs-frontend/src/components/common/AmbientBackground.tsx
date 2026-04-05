"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

export const AmbientBackground = () => {
  const [particulates, setParticulates] = useState<Particle[]>([]);

  useEffect(() => {
    const generatedParticulates = Array.from({ length: 15 }, () => ({
      id: Math.random(),
      initialX: randomInRange(0, 100),
      initialY: randomInRange(0, 100),
      duration: randomInRange(10, 20),
      delay: randomInRange(0, 5),
      driftX: randomInRange(15, 35),
      driftY: randomInRange(15, 35),
    }));

    const timer = setTimeout(() => {
      setParticulates(generatedParticulates);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    // Đã đổi "absolute inset-0" thành "fixed w-screen h-screen inset-0"
    <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden pointer-events-none">
      {/* Lớp lưới Grid: Đã xóa mask-image để lưới tràn đều không bị mờ */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Khối sáng chính */}
      {/* Khối sáng 1: Ở góc trên bên trái (Top-left) */}
      <motion.div
        animate={{
          // animate: hiệu ứng chuyển động
          x: [0, 60, -40, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.25, 0.9, 1], // scale: tỷ lệ phóng to/thu nhỏ
          opacity: [0.4, 0.7, 0.5, 0.4], // opacity: độ trong suốt/độ mờ
        }}
        transition={{
          // transition: quá trình chuyển đổi
          duration: 12, // duration: thời lượng (giây)
          repeat: Infinity, // repeat: lặp lại (Infinity: vô hạn)
          ease: "easeInOut", // ease: độ trơn tru của chuyển động
        }}
        className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/50 blur-[100px]"
      />

      {/* Khối sáng 2: THÊM MỚI - Nằm ở khoảng giữa của cạnh trái (Middle-left) */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, 60, -30, 0],
          scale: [0.9, 1.2, 0.85, 0.9],
          opacity: [0.3, 0.6, 0.4, 0.3],
        }}
        transition={{
          duration: 15, // Thời lượng dài hơn một chút để 2 khối không bay cùng nhịp
          repeat: Infinity,
          ease: "easeInOut",
        }}
        // top-[30%]: Đẩy xuống dưới một chút
        // -left-[15%]: Giấu bớt một phần ra ngoài lề trái để ánh sáng hắt vào trong
        // bg-emerald-500/40: Độ đậm giảm nhẹ một chút xíu so với khối chính
        className="absolute top-[30%] -left-[15%] w-[35%] h-[45%] rounded-full bg-emerald-500/40 blur-[100px]"
      />

      {/* Render các hạt bụi sáng */}
      {particulates.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-[3px] h-[3px] rounded-full bg-white/60 blur-[1px]"
          style={{
            top: `${particle.initialY}%`,
            left: `${particle.initialX}%`,
          }}
          animate={{
            x: [0, particle.driftX, -particle.driftX, 0],
            y: [0, -particle.driftY, particle.driftY, 0],
            opacity: [0, 0.6, 0.3, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
