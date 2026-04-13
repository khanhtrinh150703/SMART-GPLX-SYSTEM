"use client";

import React, { Suspense } from "react";
import { CreditCard } from "lucide-react";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { LicensesContent } from "@/components/features/license/components/LicensesContent"; // Đường dẫn tuỳ thuộc chỗ bạn lưu file số 2

export default function LicensesPage() {
  return (
    <Suspense fallback={<SplashScreen icon={CreditCard} message="Đang chuẩn bị dữ liệu..." />}>
      <LicensesContent />
    </Suspense>
  );
}