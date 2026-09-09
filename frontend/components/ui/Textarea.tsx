"use client";

import { TextareaHTMLAttributes } from "react";
import { theme } from "@/theme";

export default function Textarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`
        w-full
        ${theme.radius.md}
        border
        ${theme.colors.border.input}
        ${theme.colors.background.primary}
        p-4
        ${theme.colors.text.primary}
        placeholder:${theme.colors.text.subtle}
        outline-none
        ${theme.transition.default}
        focus:${theme.colors.border.focus}
        focus:ring-1
        focus:ring-blue-500
      `}
    />
  );
}