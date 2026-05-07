"use client";

import React, { Suspense } from "react";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import GplxTestPage from "@/components/features/gplx-test/components/GplxTestContent";

export default function LicensesPage() {
  return (
    // Truyền variant="user" vào đây để nó hiện icon Users và message "Đang tải học viên..."
    <Suspense fallback={<SplashScreen variant="take-exam" />}>
      <GplxTestPage />
    </Suspense>
  );
}