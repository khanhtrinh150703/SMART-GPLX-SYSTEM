"use client";

import React, { Suspense } from "react";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { QuestionsContent } from "@/components/features/question/components/QuestionContent";

export default function QuestionsPage() {
  return (
    <Suspense fallback={<SplashScreen variant="question" />}>
      <QuestionsContent />
    </Suspense>
  );
}
