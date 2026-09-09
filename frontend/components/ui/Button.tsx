"use client";

import { ButtonHTMLAttributes } from "react";
import { theme } from "@/theme";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
};

export default function Button({
  children,
  loading = false,
  loadingText = "Loading...",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        w-full
        ${theme.radius.md}
        ${theme.colors.primary.background}
        px-5
        py-3
        font-medium
        ${theme.colors.text.primary}
        ${theme.transition.default}
        ${theme.colors.primary.hover}
        disabled:cursor-not-allowed
        disabled:opacity-50
      `}
    >
      {loading ? loadingText : children}
    </button>
  );
}