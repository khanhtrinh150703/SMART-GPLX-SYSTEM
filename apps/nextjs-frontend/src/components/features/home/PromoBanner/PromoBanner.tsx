"use client";

import React from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticWrapper } from "@/components/ui/Magnetic";
import Button from "@/components/ui/Button/Button";

interface PromoBannerProps {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  buttonText: string;
  delay?: number;
}

export const PromoBanner = ({
  badge,
  title,
  highlight,
  description,
  buttonText,
  delay = 0.9
}: PromoBannerProps) => {
  return (
    <Reveal delay={delay} className="max-w-7xl mx-auto px-6 mb-20 relative z-10">
      <div className="bg-slate-900 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
        
        {/* Khối sáng xoay tròn phía sau */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full group-hover:bg-emerald-500/30 transition-colors duration-1000"
        />

        <div className="z-10 text-center md:text-left mb-8 md:mb-0 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold mb-4 border border-slate-700">
            {badge}
          </div>
          <h3 className="text-white text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              {highlight}
            </span>
          </h3>
          <p className="text-slate-400 text-lg">
            {description}
          </p>
        </div>

        <div className="z-10">
          <MagneticWrapper>
            <Button
              href={"/register"} 
              size="lg"
              className="rounded-full px-12 py-7 text-lg bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_30px_rgba(5,150,104,0.3)] transition-all"
            >
              {buttonText}
            </Button>
          </MagneticWrapper>
        </div>
      </div>
    </Reveal>
  );
};