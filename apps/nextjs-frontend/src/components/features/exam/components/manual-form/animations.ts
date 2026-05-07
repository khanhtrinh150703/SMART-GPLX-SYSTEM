// src/features/exam-mgmt/components/manual-form/animations.ts
import { Variants } from "framer-motion";

/**
 * @description Biến thể chuyển động cho từng câu hỏi (Question Item Variants)
 */
export const questionItemVariants: Variants = {
  // 1. Trạng thái khởi tạo (Initial state - trước khi xuất hiện)
  initial: { 
    opacity: 0, 
    scale: 0.8 // Bắt đầu nhỏ hơn (Start smaller)
  },

  // 2. The Rebound: Nảy nhẹ khi xuất hiện (Spring pop on enter/animate)
  animate: { 
    opacity: 1,
    scale: 1, // SỬA: Chỉ đặt giá trị đích cuối cùng (FIX: Set only the final target value)
    transition: { 
      type: "spring", 
      stiffness: 500, // Độ cứng lò xo (Spring stiffness)
      damping: 15     // SỬA: Giảm nhẹ để tăng độ nảy tự nhiên (FIX: Decrease slightly for more natural bounce)
    } 
  },

  // 3. The Elastic Shrink: Co lại và biến mất (Elastic shrink on exit)
  exit: { 
    opacity: 0,
    scale: [1, 1.1, 0], // SỬA: Giữ nguyên cái này nhưng KHÔNG đặt type: "spring" (FIX: Keep this, but DO NOT set type: "spring")
    filter: "blur(4px)", // Hiệu ứng làm mờ (Blur effect)
    transition: { 
      duration: 0.25, 
      ease: "backIn" // Chuyển động lùi nhẹ (Back-in easing - Mặc định là tween với keyframes)
    } 
  }
};