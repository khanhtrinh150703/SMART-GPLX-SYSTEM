"use client";

import React, { Suspense } from "react";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import { LicensesContent } from "@/components/features/license/components/LicensesContent";

export default function LicensesPage() {
  return (
    <Suspense fallback={<SplashScreen variant="license" />}>
      <LicensesContent />
    </Suspense>
  );
}