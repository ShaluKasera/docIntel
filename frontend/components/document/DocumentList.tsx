"use client";

import DocumentCard from "@/components/document/DocumentCard";
import EmptyState from "@/components/ui/EmptyState";

import type { Document } from "@/types/document";

type DocumentListProps = {
  documents: Document[];
  onSelect: (document: Document) => void;
  onDeleted: (documentId: string) => void;
};

export default function DocumentList({
  documents,
  onSelect,
  onDeleted,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <EmptyState
        title="No documents uploaded yet"
        description="Upload a PDF to start asking questions."
      />
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <DocumentCard
  key={document.id}
  document={document}
  onSelect={onSelect}
  onDeleted={onDeleted}
/>
      ))}
    </div>
  );
}