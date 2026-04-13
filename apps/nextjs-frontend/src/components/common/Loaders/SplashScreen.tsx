import React from "react";
import { 
  Loader2, ShieldCheck, LucideIcon, 
  BookOpen, FileQuestion, IdCard, 
  Users, UserCircle 
} from "lucide-react";

// 1. Định nghĩa các kiểu màn hình chờ có trong hệ thống
export type SplashVariant = "default" | "chapter" | "question" | "license" | "user" | "profile";

interface SplashConfig {
  message: string;
  icon: LucideIcon;
}

// 2. Gom Icon và Message vào một bản đồ cấu hình
const VARIANT_MAP: Record<SplashVariant, SplashConfig> = {
  default: {
    message: "Đang tải dữ liệu hệ thống...",
    icon: ShieldCheck,
  },
  chapter: {
    message: "Đang tải danh sách chương học...",
    icon: BookOpen,
  },
  question: {
    message: "Đang chuẩn bị bộ câu hỏi...",
    icon: FileQuestion,
  },
  license: {
    message: "Đang tải thông tin hạng bằng lái...",
    icon: IdCard,
  },
  user: {
    message: "Đang tải danh sách học viên...",
    icon: Users,
  },
  profile: {
    message: "Đang tải hồ sơ của bạn...",
    icon: UserCircle,
  },
};

interface SplashScreenProps {
  variant?: SplashVariant;
}

export default function SplashScreen({ variant = "default" }: SplashScreenProps) {
  // Lấy cấu hình dựa trên variant truyền vào
  const { message, icon: Icon } = VARIANT_MAP[variant];

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-5">
        {/* Khối Logo đập nhịp */}
        <div className="p-5 bg-white/60 backdrop-blur-md rounded-[2rem] shadow-soft border border-white/80 animate-pulse">
          <Icon size={48} className="text-emerald-500 drop-shadow-sm" />
        </div>
        
        {/* Thông tin Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Smart-GPLX <span className="text-emerald-500">.</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
            <Loader2 className="animate-spin text-emerald-500" size={16} />
            <span>{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}