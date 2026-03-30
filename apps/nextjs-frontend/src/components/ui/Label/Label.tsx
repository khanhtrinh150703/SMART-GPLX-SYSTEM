import { cn } from "@/lib/utils/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const Label = ({ children, className, ...props }: LabelProps) => {
  return (
    <label 
      // 💡 Gom tất cả tinh hoa: Slate-800, font-bold, text-sm vào 1 chỗ
      className={cn(
        "block text-sm font-bold text-slate-800 mb-3 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};