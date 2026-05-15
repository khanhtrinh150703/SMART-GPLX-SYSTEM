"use client";

import React, { Suspense } from "react";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { HistoryContainer } from "@/components/features/history/components/history-container";

export default function QuestionsPage() {
  return (
    <Suspense fallback={<SplashScreen variant="history" />}>
      <HistoryContainer />
    </Suspense>
  );
}
