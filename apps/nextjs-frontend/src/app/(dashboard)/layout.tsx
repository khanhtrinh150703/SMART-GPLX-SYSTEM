// src/app/(dashboard)/layout.tsx
"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import { cn } from "@/lib/utils/utils";
import QueryProvider from "@/components/common/Provider/QueryProvider";
import Sidebar from "@/components/common/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mặc định mở cho pro

  return (
    // 1. Dùng flex h-screen để cố định chiều cao (Dịch: Flex container for full height)
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* 2. SIDEBAR: Bây giờ nó sẽ chiếm diện tích thật 
          - lg:relative: Trên PC nó nằm trong luồng flex (Đẩy nội dung)
          - fixed: Trên Mobile nó vẫn đè lên (Vì mobile không đủ chỗ để đẩy)
      */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        className={cn(
          "transition-all duration-300 ease-in-out",
          // Trên PC: Nếu mở thì rộng 288px (w-72), nếu đóng thì rộng 0
          isSidebarOpen ? "lg:w-72" : "lg:w-0 lg:opacity-0"
        )}
      />

      {/* 3. NỘI DUNG CHÍNH: Tự động co giãn theo Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        <Header onOpenSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <QueryProvider>
          {children}
          </QueryProvider>
        </main>
      </div>
    </div>
  );
}