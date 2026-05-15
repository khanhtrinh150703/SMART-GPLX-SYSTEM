// src/components/features/gplx-test/conflict-modal.tsx

'use client'; // Bắt buộc cho component dùng hooks và window location

import dynamic from 'next/dynamic';
import { TriangleAlert } from 'lucide-react'; // Thư viện icon phổ biến
import { useExamStore } from '../store/exam.store.';
import { conflictModalVariants, dialogVariants, glowVariants } from './conflict-modal.variants';
import Button from '@/components/ui/Button/Button';
import { cn } from '@/lib/utils/utils';

const ConflictModal = () => {
  // Lấy trạng thái và hàm reset từ Zustand Store
  const { isConflict, resetStore } = useExamStore();

  if (!isConflict) return null;

  const handleRedirect = () => {
    // 1. Business Logic: Reset lại store trạng thái bài thi
    resetStore(); 
    
    // 2. Navigation: Ép tải lại trang (Hard reload) để xóa sạch state cũ trong memory
    // Dịch: Ép tải lại trang để đảm bảo dữ liệu mới nhất
    window.location.href = "/take-exam"; 
  };

  return (
    <div className={cn(conflictModalVariants())}>
      <div className={cn(dialogVariants())}>
        {/* Hiệu ứng ánh sáng nền (Decorative background glow) */}
        <div className={cn(glowVariants())} />
        
        {/* Header section với Icon cảnh báo lớn */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 border-4 border-amber-50">
            <TriangleAlert className="h-8 w-8 text-amber-600" strokeWidth={1.5} />
          </div>
          
          <h3 className="text-2xl font-extrabold text-slate-950 mb-3 tracking-tight">
            {/* Tiếng Việt: Phiên làm bài đã thay đổi */}
            Phiên làm bài đã thay đổi
          </h3>
          
          <p className="text-slate-700 mb-10 leading-relaxed text-base">
            {/* Giải thích chi tiết lỗi conflict */}
            Hệ thống phát hiện bạn vừa bắt đầu một bài thi mới ở trình duyệt hoặc tab khác. 
            Để đảm bảo tính trung thực, phiên làm bài tại tab này <span className="font-semibold text-amber-700">không còn hiệu lực</span>.
          </p>
          
          {/* Action Button: Sử dụng Variant 'primary' của Button hệ thống, 
              nhưng custom đè màu sang Amber */}
          <Button 
            onClick={handleRedirect}
            size="lg"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-amber-soft rounded-2xl active:scale-[0.97]"
          >
            {/* Tiếng Việt: Xác nhận và quay lại */}
            Tôi đã hiểu, làm mới trang
          </Button>
        </div>
      </div>
    </div>
  );
};

// Export dạng Safe Dynamic Component để tránh lỗi Hydration nếu Store lấy data từ localStorage
// Dịch: Xuất component động để tránh lỗi đồng bộ dữ liệu client/server
export const ConflictModalSafe = dynamic(() => Promise.resolve(ConflictModal), {
  ssr: false
});