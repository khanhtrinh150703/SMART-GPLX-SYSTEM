"use client";

import React, { Suspense } from "react";
// Đã xóa import CreditCard vì variant đã lo phần icon
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { ChapterContent } from "@/components/features/chapter/components/ChapterContext";

export default function ChaptersPage() {
  return (
    <Suspense fallback={<SplashScreen variant="chapter" />}>
      <ChapterContent />
    </Suspense>
  );
}