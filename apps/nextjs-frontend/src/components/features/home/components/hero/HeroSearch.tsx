"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { heroVariants } from "./hero.variants";

/**
 * Sub-component: HeroSearch (Thành phần con: Thanh tìm kiếm)
 */
export const HeroSearch = () => {
  return (
    <motion.div 
      whileFocus={{ scale: 1.02 }} 
      className={heroVariants.searchWrapper}
    >
      <input
        type="text"
        placeholder="Bạn đang quan tâm đến hạng GPLX nào?"
        className={heroVariants.searchInput}
      />
      <button 
        type="button" 
        className={heroVariants.searchButton}
        aria-label="Search"
      >
        <Search size={20} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
};