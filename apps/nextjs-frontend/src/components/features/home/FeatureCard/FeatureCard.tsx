"use client";

import React from "react";
import { LucideIcon, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/Spotlight";
import { cn } from "@/lib/utils/utils";
import { FeatureCardVariantProps, featureCardVariants } from "./feature-card.variants";

interface FeatureCardProps extends FeatureCardVariantProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
  href?: string; // Để sau này làm điều hướng (Routing)
  actionText?: string;
}

export const FeatureCard = ({
  title,
  description,
  icon: Icon,
  intent,
  delay = 0,
  actionText = "Xem chi tiết",
}: FeatureCardProps) => {
  return (
    <Reveal delay={delay}>
      <SpotlightCard className={featureCardVariants.container}>
        {/* --- Icon Layer --- */}
        <div className={cn(featureCardVariants.iconWrapper({ intent }))}>
          <Icon size={30} strokeWidth={2} />
        </div>

        {/* --- Content Layer --- */}
        <h4 className="text-xl font-bold text-slate-800 mb-2">{title}</h4>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">{description}</p>

        {/* --- Action Button --- */}
        <div className={featureCardVariants.action}>
          {actionText}
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </div>
      </SpotlightCard>
    </Reveal>
  );
};