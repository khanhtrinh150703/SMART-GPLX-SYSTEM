"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { aiPreviewVariants, scanLineVariants, type AiPreviewVariants } from "./ai-preview.variants";
import { cn } from "@/lib/utils/utils";

interface AiPreviewProps extends AiPreviewVariants {
  title: string;
  imageSrc: string;
  sessionId: string;
  statusLabel?: string;
  analysisText?: string;
  delay?: number;
  height?: string;
}

export const AiPreview = ({
  title,
  imageSrc,
  sessionId,
  statusLabel = "Live",
  analysisText = "Analysing...",
  theme = "emerald",
  delay = 0.7,
  height = "450px"
}: AiPreviewProps) => {
  return (
    <Reveal delay={delay}>
      <div className={cn(aiPreviewVariants({ theme }))}>
        {/* --- Window Header (Thanh tiêu đề giả lập) --- */}
        <div className="flex items-center justify-between px-8 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 rounded-t-[2.2rem]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-slate-300 font-medium text-sm ml-4">{title}</span>
          </div>
          <span className={cn(
            "font-semibold text-sm flex items-center gap-2",
            theme === "emerald" ? "text-emerald-400" : theme === "blue" ? "text-blue-400" : "text-rose-400"
          )}>
            <span className={cn("w-2 h-2 rounded-full animate-pulse", 
              theme === "emerald" ? "bg-emerald-400" : theme === "blue" ? "bg-blue-400" : "bg-rose-400"
            )} />
            {statusLabel}
          </span>
        </div>

        {/* --- Main Screen (Màn hình nội dung) --- */}
        <div className="relative w-full overflow-hidden bg-black rounded-b-[2.2rem]" style={{ height }}>
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
          />

          {/* 🌟 AI Scanning Line (Có thể đổi màu theo theme) */}
          <motion.div
            animate={{ y: ["0%", height, "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className={cn(scanLineVariants({ theme }))}
          />

          {/* 🌟 Technical Overlay (Thông tin kỹ thuật) */}
          <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-white font-mono text-sm z-20">
            <div className="text-slate-400 text-xs mb-1">ID: {sessionId}</div>
            <span className={cn(
              "flex items-center gap-2 mt-1",
              theme === "emerald" ? "text-emerald-400" : theme === "blue" ? "text-blue-400" : "text-rose-400"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full animate-ping", 
                theme === "emerald" ? "bg-emerald-400" : theme === "blue" ? "bg-blue-400" : "bg-rose-400"
              )} />
              {analysisText}
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
};