"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";

// --- UTILS ---
const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const shapeTypes = ["hexagon", "triangle", "square", "star", "diamond"];
const getRandomShape = () =>
  shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

// --- INTERFACES ---
interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  shape: string;
}

interface Firefly {
  id: number;
  xPath: number[];
  yPath: number[];
  duration: number;
  delay: number;
  shape: string;
}

// --- SUB-COMPONENT: RENDER SHAPE ---
const RenderShape = ({ type }: { type: string }) => {
  switch (type) {
    case "hexagon":
      return <polygon points="50 0, 93 25, 93 75, 50 100, 7 75, 7 25" />;
    case "triangle":
      return <polygon points="50 10, 100 90, 0 90" />;
    case "square":
      return <rect x="20" y="20" width="60" height="60" />;
    case "star":
      return (
        <polygon points="50 0, 61 35, 98 35, 68 57, 79 91, 50 70, 21 91, 32 57, 2 35, 39 35" />
      );
    case "diamond":
      return <polygon points="50 0, 100 50, 50 100, 0 50" />;
    default:
      return <rect x="20" y="20" width="60" height="60" />;
  }
};

// --- MAIN COMPONENT ---
export const GeometricInteractiveBackground = () => {
  const [particulates, setParticulates] = useState<Particle[]>([]);
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const [mouseShapes, setMouseShapes] = useState<string[]>([]);

  // Flag để xử lý Hydration Mismatch trong Next.js
  const [hasMounted, setHasMounted] = useState(false);

  // Mouse Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs cho hiệu ứng trễ (Smooth follow)
  const spring1 = { stiffness: 400, damping: 25 };
  const spring2 = { stiffness: 200, damping: 30 };
  const spring3 = { stiffness: 100, damping: 35 };

  const smoothX1 = useSpring(mouseX, spring1);
  const smoothY1 = useSpring(mouseY, spring1);
  const smoothX2 = useSpring(mouseX, spring2);
  const smoothY2 = useSpring(mouseY, spring2);
  const smoothX3 = useSpring(mouseX, spring3);
  const smoothY3 = useSpring(mouseY, spring3);

  // EFFECT 1: Khởi tạo dữ liệu ngẫu nhiên (Chỉ chạy ở Client)
  useEffect(() => {
    // Thay vì gọi trực tiếp, ta bọc nó vào setTimeout 0ms
    const timer = setTimeout(() => {
      setHasMounted(true);

      // Các logic khởi tạo dữ liệu ngẫu nhiên đặt ở đây luôn
      const generatedParticulates = Array.from({ length: 15 }, () => ({
        id: Math.random(),
        initialX: randomInRange(0, 100),
        initialY: randomInRange(0, 100),
        duration: randomInRange(10, 20),
        delay: randomInRange(0, 5),
        driftX: randomInRange(15, 35),
        driftY: randomInRange(15, 35),
        shape: getRandomShape(),
      }));

      const generatedFireflies = Array.from({ length: 12 }, () => ({
        id: Math.random(),
        xPath: [
          randomInRange(0, 100),
          randomInRange(10, 90),
          randomInRange(0, 100),
          randomInRange(20, 80),
        ],
        yPath: [
          randomInRange(0, 100),
          randomInRange(20, 80),
          randomInRange(0, 100),
          randomInRange(10, 90),
        ],
        duration: randomInRange(15, 25),
        delay: randomInRange(0, 2),
        shape: getRandomShape(),
      }));

      setParticulates(generatedParticulates);
      setFireflies(generatedFireflies);
      setMouseShapes([getRandomShape(), getRandomShape(), getRandomShape()]);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // EFFECT 2: Theo dõi chuột
  useEffect(() => {
    if (!hasMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Trừ đi một khoảng nhỏ để tâm hình khối nằm đúng đầu con trỏ
      mouseX.set(e.clientX - 10);
      mouseY.set(e.clientY - 10);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hasMounted, mouseX, mouseY]);

  // Ngăn chặn SSR Render những thứ ngẫu nhiên để tránh lỗi Hydration
  if (!hasMounted) {
    return <div className="fixed inset-0 bg-white" />;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden pointer-events-none bg-white">
      {/* Lưới nền (Grid Background) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* --- SAO BĂNG ĐI THEO CHUỘT --- */}
      {mouseShapes.length > 0 && (
        <>
          <motion.div
            style={{ x: smoothX3, y: smoothY3, scale: 0.6 }}
            className="absolute top-0 left-0 w-[16px] h-[16px] text-emerald-300 z-30 blur-[1px]"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <RenderShape type={mouseShapes[0]} />
            </svg>
          </motion.div>
          <motion.div
            style={{ x: smoothX2, y: smoothY2, scale: 0.8 }}
            className="absolute top-0 left-0 w-[18px] h-[18px] text-emerald-400 z-40"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <RenderShape type={mouseShapes[1]} />
            </svg>
          </motion.div>
          <motion.div
            style={{ x: smoothX1, y: smoothY1, scale: 1 }}
            className="absolute top-0 left-0 w-[20px] h-[20px] text-emerald-500 z-50 drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <RenderShape type={mouseShapes[2]} />
            </svg>
          </motion.div>
        </>
      )}

      {/* --- ĐOM ĐÓM BAY LƯỢN --- */}
      {fireflies.map((firefly) => (
        <motion.div
          key={firefly.id}
          className="absolute w-[8px] h-[8px] text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)] z-20"
          animate={{
            x: firefly.xPath.map((x) => `${x}vw`),
            y: firefly.yPath.map((y) => `${y}vh`),
            scale: [0, 1, 1.2, 1, 0],
            opacity: [0, 0.8, 0.6, 0.8, 0],
            rotate: [0, 45, -45, 0],
          }}
          transition={{
            duration: firefly.duration,
            repeat: Infinity,
            delay: firefly.delay,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <RenderShape type={firefly.shape} />
          </svg>
        </motion.div>
      ))}

      {/* --- BỤI NỀN --- */}
      {particulates.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-[16px] h-[16px] text-slate-300 z-10"
          style={{
            top: `${particle.initialY}%`,
            left: `${particle.initialX}%`,
          }}
          animate={{
            x: [0, particle.driftX, -particle.driftX, 0],
            y: [0, -particle.driftY, particle.driftY, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <RenderShape type={particle.shape} />
          </svg>
        </motion.div>
      ))}

      {/* --- ÁNH SÁNG MỜ (Glow Effects) --- */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-200/30 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 50, -30, 0],
            scale: [0.9, 1.1, 0.95, 0.9],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] w-[35%] h-[40%] rounded-full bg-emerald-100/40 blur-[120px]"
        />
      </div>
    </div>
  );
};
