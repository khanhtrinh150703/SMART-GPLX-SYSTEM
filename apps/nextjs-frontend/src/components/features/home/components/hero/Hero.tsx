"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
// import { HeroSearch } from "./HeroSearch";
import { heroVariants, heroAnimations } from "./hero.variants";

// Định nghĩa các "đầu vào" cho Hero
interface HeroProps {
  badgeText?: string;
  titleLine1: string;
  titleHighlight: string;
  description: string;
  showSearch?: boolean; // Có hiển thị thanh tìm kiếm không?
}

export const Hero = ({
  badgeText = "Áp dụng công nghệ AI", // Giá trị mặc định
  titleLine1,
  titleHighlight,
  description,
  // showSearch = true
}: HeroProps) => {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-40 pb-20 relative z-10">
      <header className="text-center space-y-6 max-w-3xl mx-auto mb-24">
        
        {/* 1. Badge */}
        <Reveal delay={0.1}>
          <motion.div {...heroAnimations.badge} className={heroVariants.badge}>
            <Sparkles size={16} /> {badgeText}
          </motion.div>

          {/* 2. Main Title */}
          <h1 className={heroVariants.title}>
            {titleLine1} <br />
            <motion.span {...heroAnimations.gradient} className={heroVariants.gradientText}>
              {titleHighlight}
            </motion.span>
          </h1>
        </Reveal>

        {/* 3. Description */}
        <Reveal delay={0.2}>
          <p className={heroVariants.description}>
            {description}
          </p>
        </Reveal>

        {/* 4. Search Bar (Chỉ hiện nếu showSearch = true) */}
        {/* {showSearch && (
          <Reveal delay={0.3}>
            <HeroSearch />
          </Reveal>
        )} */}
      </header>
    </section>
  );
};