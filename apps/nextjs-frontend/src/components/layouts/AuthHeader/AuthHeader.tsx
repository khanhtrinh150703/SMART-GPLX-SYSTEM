// src/components/ui/AuthHeader.tsx

import { cn } from "@/lib/utils/utils";
import { headingVariants, textVariants } from "./authheader.variants";

interface AuthHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export const AuthHeader = ({ title, description, className }: AuthHeaderProps) => {
  return (
    <div className={cn("text-center mb-10", className)}>
      <h2 className={headingVariants({ intent: "h2" })}>
        {title}
      </h2>
      {description && (
        <p className={textVariants({ intent: "description" })}>
          {description}
        </p>
      )}
    </div>
  );
};