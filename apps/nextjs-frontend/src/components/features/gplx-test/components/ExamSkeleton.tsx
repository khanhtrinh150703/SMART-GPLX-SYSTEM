import { cn } from "@/lib/utils/utils";
import { cardVariants } from "./exam-card.variants";

export const ExamSkeleton = ({ size = "md" }: { size?: "sm" | "md"  }) => (
  <div className={cn(cardVariants({ size }), "animate-pulse")}>
    <div className="flex justify-between items-start w-full">
      <div className="w-10 h-10 bg-slate-100 rounded-2xl" />
      <div className="w-20 h-5 bg-slate-50 rounded-lg" />
    </div>
    <div className="space-y-3 mt-4">
      <div className="h-6 bg-slate-100 rounded-lg w-3/4" />
      <div className="h-4 bg-slate-50 rounded-lg w-1/2" />
    </div>
    <div className="mt-auto space-y-4 pt-4 border-t border-slate-50">
      <div className="grid grid-cols-3 gap-2">
        <div className="h-8 bg-slate-50 rounded-lg" />
        <div className="h-8 bg-slate-50 rounded-lg" />
        <div className="h-8 bg-slate-50 rounded-lg" />
      </div>
      <div className="h-10 bg-slate-100 rounded-xl w-full" />
    </div>
  </div>
);