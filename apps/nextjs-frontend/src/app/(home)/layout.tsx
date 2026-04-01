"use client";

import { Footer } from "@/components/layouts/Footer";
import { ScrollProgress } from "@/components/common/ScrollProgress";
import { Navbar } from "@/components/layouts/Navbar/Navbar";
import { ReactLenis } from "lenis/react";

export default function LandingPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: 1.5, smoothWheel: true, syncTouch: true }}
    >
      <ScrollProgress />
      <Navbar />
      <div className="relative flex min-h-screen flex-col">{children}</div>
      <Footer
        companyName="Smart Driving AI"
        phone="1900 1234"
        email="support@smart-driving.ai"
        year={2026}
      />
    </ReactLenis>
  );
}
