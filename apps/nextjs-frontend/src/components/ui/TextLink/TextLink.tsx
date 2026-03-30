// src/components/ui/TextLink.tsx
import Link, { LinkProps } from "next/link";
import { VariantProps } from "class-variance-authority";
import { linkVariants } from "./link.variants";
import { cn } from "@/lib/utils/utils";

interface TextLinkProps 
  extends LinkProps, 
    VariantProps<typeof linkVariants> {
  children: React.ReactNode;
  className?: string;
}

export default function TextLink({ 
  intent, 
  size, 
  children, 
  className, 
  ...props 
}: TextLinkProps) {
  return (
    <Link
      className={cn(linkVariants({ intent, size }), className)}
      {...props}
    >
      {children}
    </Link>
  );
}