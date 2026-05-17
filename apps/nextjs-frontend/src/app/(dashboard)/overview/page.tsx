"use client";

import React from "react";
import { BookOpen, Target, Signpost } from "lucide-react";

export default function WelcomePage() {
  // Lấy ngày hiện tại theo định dạng thân thiện của Việt Nam
  const currentDate = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-8">
      {/* 🟢 KHU VỰC CHÀO MỪNG CHUNG (General Welcome Banner) */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] p-8 md:p-10 text-white shadow-lg shadow-emerald-200/50 flex flex-col md:flex-row items-start md:flex-wrap md:items-center justify-between relative overflow-hidden">
        {/* Khối sáng trang trí nền (Ambient background glow) */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
            Chào mừng bạn quay trở lại! 👋
          </h1>
          <p className="text-emerald-50 text-lg font-medium opacity-90">
            Hôm nay là {currentDate}. Hãy tiếp tục hành trình chinh phục giấy
            phép lái xe nhé!
          </p>
        </div>

        {/* Khối Icon động lực học tập (Motivation Icon block) */}
        <div className="hidden md:flex relative z-10 mt-6 md:mt-0">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center shadow-inner text-2xl select-none">
            🚀
          </div>
        </div>
      </div>

      {/* 🟢 KHU VỰC LỐI TẮT CHỨC NĂNG (Quick Access Cards) */}
      {/* Thay vì hiển thị thống kê Admin, hiển thị các thẻ bấm vào để học ngay */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thẻ Lối tắt 1: Học lý thuyết */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col group hover:shadow-md hover:border-emerald-200 transition-all duration-300 cursor-pointer active:scale-[0.98]">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
              <BookOpen size={24} />
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
              Phổ biến
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Ôn tập lý thuyết
          </h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Học bộ 600 câu hỏi sát hạch chuẩn, phân loại rõ ràng theo từng chủ
            đề.
          </p>
        </div>

        {/* Thẻ Lối tắt 2: Thi thử nghiệm */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col group hover:shadow-md hover:border-teal-200 transition-all duration-300 cursor-pointer active:scale-[0.98]">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
              <Target size={24} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Thi thử sát hạch
          </h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Làm bài thi thử mô phỏng thời gian thực với cấu trúc đề chuẩn từ bộ
            GTVT.
          </p>
        </div>

        {/* Thẻ Lối tắt 3: Tra cứu biển báo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col group hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer active:scale-[0.98]">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
              <Signpost size={24} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Tra cứu biển báo
          </h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Danh mục tra cứu toàn bộ hệ thống biển báo giao thông đường bộ Việt
            Nam.
          </p>
        </div>
      </div>
    </div>
  );
}
