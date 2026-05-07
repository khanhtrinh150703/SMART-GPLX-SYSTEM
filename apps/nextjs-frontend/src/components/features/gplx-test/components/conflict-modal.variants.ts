import { cva } from 'class-variance-authority';

// Chuyển đổi sang tông màu Amber (Warning) để tăng sự chú ý
// Sử dụng kết hợp Glassmorphism mạnh và Neumorphism shadow

export const conflictModalVariants = cva(
  // Overlay (Lớp phủ nền): Tăng độ mờ băm (backdrop-blur) và làm tối nền hơn
  "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md transition-opacity duration-300",
  {
    variants: {
      intent: {
        primary: "", // Mặc định
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);

export const dialogVariants = cva(
  // Dialog Content: Bo góc cực lớn, viền Amber gradient, đổ bóng phức hợp
  "relative bg-white/90 p-10 rounded-3xl shadow-[0_20px_50px_rgba(245,158,11,0.15),0_0_0_1px_rgba(245,158,11,0.1)] max-w-lg w-full border border-amber-200/50 backdrop-blur-lg animate-reveal overflow-hidden",
  {
    variants: {
      intent: {
        warning: "", // Mặc định cho conflict
      },
    },
    defaultVariants: {
      intent: "warning",
    },
  }
);

// Tạo một lớp trang trí hiệu ứng ánh sáng phía sau (Glow effect)
export const glowVariants = cva(
  "absolute -top-24 -left-24 w-48 h-48 bg-amber-400 rounded-full opacity-20 blur-[80px] pointer-events-none"
);