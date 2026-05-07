import React from "react";
import { 
  Loader2, ShieldCheck, LucideIcon, 
  BookOpen, FileQuestion, IdCard, 
  Users, UserCircle, FileUp, 
  PencilLine, History, ClipboardList, 
  Grid3X3 
} from "lucide-react";

// 1. Cập nhật các kiểu màn hình chờ mới
export type SplashVariant = 
  | "default" 
  | "chapter" 
  | "question" 
  | "license" 
  | "user" 
  | "profile"
  | "import"
  | "take-exam"
  | "history"
  | "exam"
  | "exam-matrices";

interface SplashConfig {
  message: string;
  icon: LucideIcon;
}

// 2. Cấu hình Icon và Message bổ sung
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
  // Các variant mới thêm vào:
  import: {
    message: "Đang xử lý nhập dữ liệu tệp tin...",
    icon: FileUp,
  },
  "take-exam": {
    message: "Đang thiết lập phòng thi trực tuyến...",
    icon: PencilLine,
  },
  history: {
    message: "Đang truy xuất lịch sử sát hạch...",
    icon: History,
  },
  exam: {
    message: "Đang tải danh sách đề thi...",
    icon: ClipboardList,
  },
  "exam-matrices": {
    message: "Đang khởi tạo ma trận cấu trúc đề...",
    icon: Grid3X3,
  },
};

interface SplashScreenProps {
  variant?: SplashVariant;
}

export default function SplashScreen({ variant = "default" }: SplashScreenProps) {
  const { message, icon: Icon } = VARIANT_MAP[variant];

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-5">
        <div className="p-5 bg-white/60 backdrop-blur-md rounded-[2rem] shadow-soft border border-white/80 animate-pulse">
          <Icon size={48} className="text-emerald-500 drop-shadow-sm" />
        </div>
        
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