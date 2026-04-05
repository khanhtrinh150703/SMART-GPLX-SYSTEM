// src/components/features/home/GPLXCard.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface GPLXCardProps {
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
}

export const GPLXCard = ({ title, subtitle, image, badge }: GPLXCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -12, rotateX: 2, rotateY: -2 }} // 3D Lifting Effect
      className="group relative bg-white rounded-[2.5rem] p-6 shadow-soft hover:shadow-lift transition-all duration-500 border border-slate-100 overflow-hidden cursor-pointer"
    >
      {/* Emerald Accent Line (Đường nhấn xanh lục) */}
      <div className="absolute left-0 top-1/4 w-1 h-1/2 bg-emerald-500 rounded-r-full" />
      
      {badge && (
        <span className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          {badge}
        </span>
      )}

      <div className="relative h-48 w-full mb-6">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
          priority
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-slate-500 text-sm">{subtitle}</p>
      </div>
    </motion.div>
  );
};