"use client";

import React, { Suspense } from "react";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import AdminUserManagementPage from "@/components/features/admin-users/components/UserContext";

export default function LicensesPage() {
  return (
    // Truyền variant="user" vào đây để nó hiện icon Users và message "Đang tải học viên..."
    <Suspense fallback={<SplashScreen variant="user" />}>
      <AdminUserManagementPage />
    </Suspense>
  );
}