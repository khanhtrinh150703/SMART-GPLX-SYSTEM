"use client";

import React, { Suspense } from "react";
import SplashScreen from "@/components/common/Loaders/SplashScreen";
import ProfileForm from "@/components/features/profile/components/ProfileForm";

export default function ProfilePage() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Hồ sơ cá nhân
        </h2>
        <p className="text-slate-500 mt-2">
          Cấu hình thông tin định danh cho hệ thống Smart-GPLX AI.
        </p>
      </div>

      <Suspense fallback={<SplashScreen variant="profile" />}>
        <ProfileForm />
      </Suspense>
    </>
  );
}