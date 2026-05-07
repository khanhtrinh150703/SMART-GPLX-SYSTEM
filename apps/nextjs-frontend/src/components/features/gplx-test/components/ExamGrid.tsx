import { cn } from "@/lib/utils/utils";

/**
 * ExamGrid: Hệ thống lưới hiển thị đề thi.
 * Chỉnh xl:grid-cols-3 để Card có không gian vươn chiều ngang.
 */
export const ExamGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full px-4 py-8">
      <div className={cn(
        "mx-auto max-w-[1400px] grid gap-8 justify-items-center",
        // Mobile: 1 | Tablet: 2 | Desktop: 3
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
      )}>
        {children}
      </div>
    </div>
  );
};