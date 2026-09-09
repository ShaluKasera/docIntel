import { ReactNode } from "react";
import { theme } from "@/theme";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        ${theme.radius.lg}
        border
        ${theme.colors.border.default}
        ${theme.colors.background.secondary}
        p-6
        ${theme.shadow.card}
        ${className}
      `}
    >
      {children}
    </div>
  );
}