// src/components/ui/profile/ProfileSidebar.tsx
'use client';

import React from "react";
import { cn } from "@/lib/utils/utils";
import { profileSidebarVariants } from "./profile.variants";

interface ProfileSidebarProps {
  children: React.ReactNode;
  statusText?: string;
  subStatusText?: string;
  isActive?: boolean;
}

export const ProfileSidebar = ({ 
  children, 
  statusText = "Học viên active", 
  subStatusText = "Sẵn sàng học tập",
  isActive = true 
}: ProfileSidebarProps) => {
  return (
    <div className={profileSidebarVariants({ status: isActive ? "active" : "inactive" })}>
      {/* 🖼️ Phần Avatar: Được truyền qua children */}
      {children}

      {/* 🟢 Status Indicator (Chỉ báo trạng thái) */}
      <div className="text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          {statusText}
        </p>
        <div className="flex items-center gap-2 mt-1 justify-center">
          <span className={cn(
            "w-2 h-2 rounded-full",
            isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
          )} />
          <span className="text-xs font-bold text-slate-600">
            {subStatusText}
          </span>
        </div>
      </div>
    </div>
  );
};