"use client";

import { useEffect } from "react";
import { Hero } from "@/components/features/home/components/hero";
import { CategoryCard } from "@/components/features/home/CategoryCard/CategoryCard";
import { AiPreview } from "@/components/ui/Ai/AiPreview";
import { FeatureCard } from "@/components/features/home";
import { HOME_FEATURES } from "@/components/features/home/FeatureCard/feature-card.constants";
import { Reveal } from "@/components/ui/Reveal";
import { PromoBanner } from "@/components/features/home/PromoBanner";
import { GeometricInteractiveBackground } from "@/components/common/EmeraldWhiteAurora";
// import { AmbientBackground } from "@/components/common/AmbientBackground";

export default function LandingPage() {
  useEffect(() => {
    // Đánh thức toàn bộ hệ thống animation sau 100ms
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden relative">
      {/* <AmbientBackground /> */}
      <GeometricInteractiveBackground/>
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-20 relative z-10">
        <Hero
          titleLine1="Khám Phá Giải Pháp Học &"
          titleHighlight="Tư Tin Trong Việc Học GPLX Một Cách Thông Minh"
          description="Tự tin chinh phục kỳ thi lý thuyết và thực hành với giải pháp công nghệ thông minh, minh bạch và hiệu quả cao."
        />
        <div className="mb-24">
          <Reveal delay={0.4}>
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-500 rounded-full" /> Trí tuệ
              nhân tạo (AI) hỗ trợ
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CategoryCard
              intent="emerald"
              delay={0.5}
              title="GPLX B2 - Hạng xe ô tô"
              imageSrc="/images/car-b2.png"
              badgeText="B2"
              description="Hệ thống AI nhận diện hành vi lái xe ô tô"
            />
            <CategoryCard
              intent="teal"
              delay={0.6}
              title="GPLX A1 - Hạng xe máy"
              imageSrc="/images/moto-a1.png"
              badgeText="A1"
              ribbonText="Phổ biến"
              description="Mô phỏng thi vòng số 8 bằng cảm biến"
            />
          </div>
        </div>
        <AiPreview
          theme="emerald"
          title="Hạng GPLX B2 - AI Camera System"
          imageSrc="/images/ai-driving-preview.jpg"
          sessionId="#B2-ACTIVE-88"
          analysisText="Analysing Road Signs..."
        />
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOME_FEATURES.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              description={feature.desc}
              delay={0.4 + idx * 0.1}
            />
          ))}
        </div>
      </main>

      <PromoBanner
        badge="🎉 KHUYẾN MÃI"
        title="Mọi thứ đều"
        highlight="miễn phí"
        description="Trải nghiệm hệ thống học lý thuyết không giới hạn."
        buttonText="Đăng ký ngay"
      />
    </div>
  );
}
