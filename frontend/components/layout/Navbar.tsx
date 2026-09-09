import { theme } from "@/theme";

export default function Navbar() {
  return (
    <nav
      className={`
        border-b
        ${theme.colors.border.default}
        ${theme.colors.background.secondary}
      `}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <h1
            className={`text-xl font-bold ${theme.colors.text.primary}`}
          >
            DocIntel
          </h1>

          <p
            className={`text-xs ${theme.colors.text.subtle}`}
          >
            AI Document Intelligence
          </p>
        </div>

        <div
          className={`text-sm ${theme.colors.text.muted}`}
        >
          RAG Powered
        </div>
      </div>
    </nav>
  );
}