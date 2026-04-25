// src/app/(dashboard)/layout.tsx
"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import { cn } from "@/lib/utils/utils";
import QueryProvider from "@/components/common/Provider/QueryProvider";
import Sidebar from "@/components/common/Sidebar";
import { useSyncLogout } from "@/hooks/use-sync-logout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mặc định mở cho pro
  useSyncLogout();
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      

      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        className={cn(
          "transition-all duration-300 ease-in-out",
          // Trên PC: Nếu mở thì rộng 288px (w-72), nếu đóng thì rộng 0
          isSidebarOpen ? "lg:w-72" : "lg:w-0 lg:opacity-0"
        )}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        <Header 
          isOpen={isSidebarOpen} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <QueryProvider>
          {children}
          </QueryProvider>
        </main>
      </div>
    </div>
  );
}