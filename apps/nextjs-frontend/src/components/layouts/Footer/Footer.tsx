"use client";

import React from "react";
import { Mail, Phone, Globe } from "lucide-react";
import { footerVariants } from "./footer.variants";

// Cấu trúc định nghĩa kiểu dữ liệu cho các thuộc tính nhận vào (Properties interface definition)
interface FooterProps {
  companyName?: string; // Tên hệ thống/công ty (System/Company name)
  phone?: string;       // Số điện thoại liên hệ (Contact phone number)
  email?: string;       // Địa chỉ thư điện tử (Contact email address)
  website?: string;     // Đường dẫn trang web (Website URL path)
  year?: number;        // Năm hiển thị bản quyền (Copyright year representation)
}

export const Footer = ({
  companyName = "Smart-GPLX",
  phone = "(079) 356 272",
  email = "smart-gplx.vn",
  website = "www.smart-gplx.vn",
  year = new Date().getFullYear(),
}: FooterProps) => {
  return (
    <footer className={footerVariants.container}>
      {/* 🟢 BỔ SUNG LẠI: Khung chứa nội bộ để giữ hai khối cân bằng hai đầu (Restored inner layout container) */}
      <div className={footerVariants.inner}>
        
        {/* Khối Thương hiệu & Bản quyền (Brand & Copyright block) */}
        <div className={footerVariants.brandWrapper}>
          {/* Chiếc hộp bo góc gradient chứa chữ S chuẩn UI cao cấp (Gradient bounding box wrapper) */}
          <div className="relative w-10 h-10 shrink-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_8px_16px_-6px_rgba(16,185,129,0.5)] border border-emerald-300/20">
            <span className="text-white font-black text-2xl tracking-tighter drop-shadow-sm select-none">
              S
            </span>
          </div>

          <p className={footerVariants.copyright}>
            © {year}{" "}
            <span className="text-slate-800 font-bold">{companyName}</span>. All
            rights reserved.
          </p>
        </div>

        {/* --- Phía bên phải: Liên kết liên hệ (Right Side: Contact Links) --- */}
        <div className={footerVariants.linkGroup}>
          {/* Đường dẫn gọi điện thoại (Phone call action link) */}
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className={footerVariants.linkItem}
          >
            <Phone
              size={16}
              className="text-emerald-400 transition-colors duration-200"
            />
            {phone}
          </a>

          {/* Đường dẫn gửi email (Email messaging link) */}
          <a href={`mailto:${email}`} className={footerVariants.linkItem}>
            <Mail
              size={16}
              className="text-emerald-400 transition-colors duration-200"
            />
            {email}
          </a>

          {/* Đường dẫn truy cập trang web (External website target link) */}
          <a
            href={`https://${website}`}
            target="_blank"
            className={footerVariants.linkItem}
            rel="noopener noreferrer"
          >
            <Globe
              size={16}
              className="text-emerald-400 transition-colors duration-200"
            />
            {website}
          </a>
        </div>

      </div>
    </footer>
  );
};