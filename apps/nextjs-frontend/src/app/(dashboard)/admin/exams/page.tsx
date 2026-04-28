"use client";

import React, { Suspense } from "react";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { ExamContent } from "@/components/features/exam/schema/ExamContent";

export default function ExamMatrixPage() {
  return (
    <Suspense fallback={<SplashScreen variant="question" />}>
      <ExamContent />
    </Suspense>
  );
}
