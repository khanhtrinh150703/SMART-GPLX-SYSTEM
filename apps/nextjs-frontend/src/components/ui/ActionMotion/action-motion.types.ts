export type ActionVariant = "emerald" | "rose" | "slate";
/** 
 * Predefined size variants (Các biến thể kích thước định nghĩa sẵn) 
 */
export type ActionSize = "sm" | "md" | "lg" | "xl";

export interface ActionMotionProps {
  onClick?: () => void;
  isLoading?: boolean;
  icon: React.ReactNode;
  label: string;
  className?: string;
  variant?: ActionVariant;
  size?: ActionSize; // Thuộc tính mới
}