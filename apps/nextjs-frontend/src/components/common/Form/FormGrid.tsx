import { cn } from "@/lib/utils/utils";

// src/components/common/Form/FormGrid.tsx
export const FormGrid = ({ children, cols = 1 }: { children: React.ReactNode, cols?: 1 | 2 | 3 }) => {
  const gridConfigs = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
  };
  return <div className={cn("grid gap-5", gridConfigs[cols])}>{children}</div>;
};