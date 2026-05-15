// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** * cn (Classname Merge):
 * Hàm tiện ích giúp gộp các class Tailwind và xử lý xung đột.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Chuyển đổi giây thành chuỗi hiển thị (VD: 2011 -> "33p 31s")
 */
export function formatDurationSeconds(seconds: number): string {
  if (!seconds || seconds === 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}p ${s}s`;
}
