"use client";

import React, { Suspense } from "react";
import { CreditCard } from "lucide-react";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { QuestionsContent } from "@/components/features/question/components/QuestionContent";

export default function LicensesPage() {
  return (
    <Suspense fallback={<SplashScreen icon={CreditCard} message="Đang chuẩn bị dữ liệu..." />}>
      <QuestionsContent />
    </Suspense>
  );
}