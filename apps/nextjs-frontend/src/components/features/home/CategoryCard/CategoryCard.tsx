"use client";

import React from "react";
import Image from "next/image";
import { SpotlightCard } from "@/components/ui/Spotlight";
import { categoryCardVariants, type CategoryCardProps } from "./category-card.variants";
import { Reveal } from "@/components/ui/Reveal";

interface Props extends CategoryCardProps {
  title: string;
  description: string;
  imageSrc: string;
  badgeText: string;
  ribbonText?: string;
  delay?: number;
}

export const CategoryCard = ({
  title,
  description,
  imageSrc,
  badgeText,
  ribbonText,
  intent,
  delay = 0,
}: Props) => {
  return (
    <Reveal delay={delay} className="h-full">
      <SpotlightCard className={categoryCardVariants.container}>
        {/* 1. Ribbon (Nếu có) */}
        {ribbonText && (
          <div className={categoryCardVariants.ribbon}>{ribbonText}</div>
        )}

        {/* 2. Badge tên hạng */}
        <div className={categoryCardVariants.badge({ intent })}>{badgeText}</div>

        {/* 3. Image Section với Hiệu ứng Glow */}
        <div className="relative h-56 w-full mb-6 flex items-center justify-center">
          <div className={categoryCardVariants.glow({ intent })} />
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-rotate-2 transition-all duration-700 ease-out"
          />
        </div>

        {/* 4. Text Section */}
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500">{description}</p>
        </div>
      </SpotlightCard>
    </Reveal>
  );
};