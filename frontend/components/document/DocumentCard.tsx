"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { toast } from "sonner";

import type { Document } from "@/types/document";
import { deleteDocument } from "@/services/documentService";

type DocumentCardProps = {
  document: Document;
  onSelect: (document: Document) => void;
  onDeleted: (documentId: string) => void;
};

export default function DocumentCard({
  document,
  onSelect,
  onDeleted,
}: DocumentCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await deleteDocument(document.id);

      setShowDeleteModal(false);

      onDeleted(document.id);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to delete document."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card
        className="
          transition
          hover:border-blue-500
        "
      >
        <div className="flex items-center justify-between gap-4">
         <button
  type="button"
  onClick={() => onSelect(document)}
  disabled={deleting}
  className="
    min-w-0
    flex-1
    rounded-xl
    p-2
    text-left
    transition
    hover:bg-slate-800/50
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
>
            <h3 className="truncate font-medium text-white">
              📄 {document.filename}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">
  <span>
    {document.total_pages} pages
  </span>

  <span>
    {(document.file_size / (1024 * 1024)).toFixed(2)} MB
  </span>

  <span
    className="
      rounded-full
      border
      border-green-900
      bg-green-950
      px-2.5
      py-1
      text-xs
      font-medium
      text-green-300
    "
  >
    {document.status}
  </span>
</div>
              <p className="mt-3 text-xs text-blue-400">
    Click to open workspace →
  </p>
           
          </button>

          <button
            type="button"
            onClick={() => {
              setShowDeleteModal(true);
            }}
            disabled={deleting}
            className="
              shrink-0
              rounded-lg
              border
              border-red-900
              px-3
              py-2
              text-sm
              text-red-400
              transition
              hover:bg-red-950
              hover:text-red-300
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Delete
          </button>
        </div>
      </Card>

      <ConfirmModal
        open={showDeleteModal}
        title="Delete document?"
        description={`This will permanently delete "${document.filename}" along with its chunks and embeddings.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) {
            setShowDeleteModal(false);
          }
        }}
      />
    </>
  );
}