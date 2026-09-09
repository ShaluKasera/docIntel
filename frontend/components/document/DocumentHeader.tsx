"use client";

import type { Document } from "@/types/document";

type DocumentHeaderProps = {
  document: Document;
  onBack: () => void;
};

export default function DocumentHeader({
  document,
  onBack,
}: DocumentHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">
            Document workspace
          </p>

          <h2 className="mt-1 truncate text-2xl font-semibold text-white">
            📄 {document.filename}
          </h2>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
            <span>
              {document.total_pages} pages
            </span>

            <span>
              {(document.file_size / (1024 * 1024)).toFixed(2)} MB
            </span>

            <span className="capitalize">
              {document.status}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="
            shrink-0
            rounded-lg
            px-4
            py-2
            text-sm
            text-slate-400
            transition
            hover:bg-slate-800
            hover:text-white
          "
        >
          ← Documents
        </button>
      </div>
    </div>
  );
}