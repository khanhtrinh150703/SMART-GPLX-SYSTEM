"use client";

import React, { Suspense } from "react";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { ExamMatrixContent } from "@/components/features/exam-management/components/ExamMatrixContent";

export default function ExamMatrixPage() {
  return (
    <Suspense fallback={<SplashScreen variant="question" />}>
      <ExamMatrixContent />
    </Suspense>
  );
}
