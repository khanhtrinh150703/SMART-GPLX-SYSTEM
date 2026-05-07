"use client";

import { motion } from "framer-motion";
import { Search, RefreshCw } from "lucide-react";
import ActionMotion from "@/components/ui/ActionMotion/ActionMotion";
import Button from "@/components/ui/Button/Button";
import { cn } from "@/lib/utils/utils";
import { actionContainerVariants } from "./ResultActions.variants";

interface ResultActionsProps {
  onRestart: () => void;
  onReview: () => void;
  isPassed: boolean;
}

export const ResultActions = ({
  onRestart,
  onReview,
  isPassed,
}: ResultActionsProps) => {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={cn(actionContainerVariants())}
    >
      <Button
        onClick={onRestart}
        className={cn(
          "h-[52px] w-full md:w-auto md:px-6 shrink-0 rounded-2xl",
          "bg-white border-2 border-slate-100 text-slate-500",
          "hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50",
          "transition-all flex items-center justify-center gap-2 group shadow-sm",
        )}
      >
        <RefreshCw
          size={20}
          className="group-hover:-rotate-180 transition-transform duration-700"
        />
        <span className="font-bold text-sm tracking-wide">THI LẠI</span>
      </Button>

      <div className="w-full md:flex-1 h-[52px]">
        <ActionMotion
          variant={isPassed ? "emerald" : "rose"}
          label="XEM ĐÁP ÁN CHI TIẾT"
          icon={<Search size={18} strokeWidth={2.5} />}
          onClick={onReview}
          className="w-full h-full"
        />
      </div>
    </motion.div>
  );
};
