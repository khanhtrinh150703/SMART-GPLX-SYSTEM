"use client";

import React from "react";
import { Mail, Phone, Globe } from "lucide-react";
import { footerVariants } from "./footer.variants";

interface FooterProps {
  companyName?: string;
  phone?: string;
  email?: string;
  website?: string;
  year?: number;
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
      <div className={footerVariants.inner}>
        
        {/* --- Left Side: Brand & Copyright --- */}
        <div className={footerVariants.brandWrapper}>
          <div className={footerVariants.logoBox}>
            <span className={footerVariants.logoText}>
              {companyName.charAt(0)}
            </span>
          </div>
          <p className={footerVariants.copyright}>
            © {year} <span className="text-slate-800 font-bold">{companyName}</span>. All rights reserved.
          </p>
        </div>

        {/* --- Right Side: Contact Links (Mở rộng dễ dàng) --- */}
        <div className={footerVariants.linkGroup}>
          {/* Link Điện thoại */}
          <a href={`tel:${phone.replace(/\s/g, "")}`} className={footerVariants.linkItem}>
            <Phone size={16} className="text-emerald-500" />
            {phone}
          </a>

          {/* Link Email */}
          <a href={`mailto:${email}`} className={footerVariants.linkItem}>
            <Mail size={16} className="text-emerald-500" />
            {email}
          </a>

          {/* Link Website (Dễ dàng thêm mới) */}
          <a href={`https://${website}`} target="_blank" className={footerVariants.linkItem}>
            <Globe size={16} className="text-emerald-500" />
            {website}
          </a>
        </div>

      </div>
    </footer>
  );
};