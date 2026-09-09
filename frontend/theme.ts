export const theme = {
  colors: {
    background: {
      primary: "bg-slate-950",
      secondary: "bg-slate-900",
      tertiary: "bg-slate-800",
    },

    text: {
      primary: "text-white",
      secondary: "text-slate-300",
      muted: "text-slate-400",
      subtle: "text-slate-500",
      disabled: "text-slate-600",
    },

    border: {
      default: "border-slate-800",
      input: "border-slate-700",
      focus: "border-blue-500",
    },

    primary: {
      background: "bg-blue-600",
      hover: "hover:bg-blue-500",
      text: "text-blue-400",
    },

    danger: {
      background: "bg-red-950",
      text: "text-red-300",
      border: "border-red-900",
    },

    success: {
      background: "bg-green-950",
      text: "text-green-300",
    },
  },

  radius: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
  },

  shadow: {
    card: "shadow-lg",
  },

  transition: {
    default: "transition",
  },
} as const;