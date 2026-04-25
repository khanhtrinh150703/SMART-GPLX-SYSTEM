"use client";

import React, { Suspense } from "react";
// Đã xóa import CreditCard vì variant="question" sẽ tự lấy icon FileQuestion
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { QuestionsContent } from "@/components/features/question/components/QuestionContent";

export default function QuestionsPage() {
  return (
    <Suspense fallback={<SplashScreen variant="question" />}>
      <QuestionsContent />
    </Suspense>
  );
}
