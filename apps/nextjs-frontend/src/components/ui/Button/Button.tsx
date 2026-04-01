"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/Button/button.variants";
import { cn } from "@/lib/utils/utils";

// 1. Định nghĩa các Props dùng chung cho cả 2 loại
interface BaseProps extends VariantProps<typeof buttonVariants> {
  text?: string;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// 2. Tạo Union Type: Một là Button thuần, hai là Link
// Dùng { href?: never } để đảm bảo nếu là button thì không được phép truyền href
type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

// Nếu là Link thì href là bắt buộc
type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  LinkProps & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  text,
  isLoading,
  variant,
  size,
  children,
  className,
  ...props
}: ButtonProps) {
  const combinedClassName = cn(buttonVariants({ variant, size }), className);

  const InnerContent = (
    <>
      {isLoading && (
        <svg
          className="w-5 h-5 animate-spin text-current shrink-0"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {/* <span className={cn(isLoading && "opacity-0 invisible")}> */}
      {text || children}
      {/* </span> */}
    </>
  );

  // 3. Narrowing Type: Kiểm tra xem props có chứa href hay không
  if ("href" in props && props.href !== undefined) {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={combinedClassName} {...linkProps}>
        {InnerContent}
      </Link>
    );
  }

  // 4. Trường hợp là Button thuần
  const { disabled, ...buttonProps } = props as ButtonAsButton;
  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...buttonProps}
    >
      {InnerContent}
    </button>
  );
}
