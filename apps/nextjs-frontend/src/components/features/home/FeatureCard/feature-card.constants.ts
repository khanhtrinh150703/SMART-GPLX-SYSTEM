// 💡 Nhớ đổi tên file thành .tsx nhé!
import { BookOpen, Calendar, Settings } from "lucide-react";

export const HOME_FEATURES = [
  {
    title: "Tài liệu học chuẩn",
    desc: "Giáo trình 600 câu hỏi lý thuyết mới nhất.",
    icon: BookOpen,
    intent: "emerald" as const,
  },
  {
    title: "Lịch thi linh hoạt",
    desc: "Đăng ký ca thi nhanh chóng, kết quả minh bạch.",
    icon: Calendar,
    intent: "blue" as const,
  },
  {
    title: "Hỗ trợ 24/7",
    desc: "Giải đáp mọi thắc mắc về hồ sơ và thủ tục.",
    icon: Settings,
    intent: "amber" as const,
  },
];