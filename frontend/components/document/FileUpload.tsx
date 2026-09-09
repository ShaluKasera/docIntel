"use client";

import { useRef, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

type FileUploadProps = {
  onUploaded: () => void;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function FileUpload({
  onUploaded,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0] || null;

    setFile(null);

    if (!selectedFile) {
      return;
    }

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Only PDF files are allowed.");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 10 MB.");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `${API_URL}/api/v1/documents/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to upload document."
        );
      }

      toast.success(
        `${data.filename} uploaded successfully.`
      );

      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      onUploaded();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <Card>
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
        Document Ingestion
      </p>

      <h2 className="mt-1 text-xl font-semibold text-white">
        Upload a PDF
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Upload a PDF document to create a searchable AI knowledge base.
      </p>
    </div>

    <label
      htmlFor="pdf-upload"
      className="
        mt-6
        flex
        cursor-pointer
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-slate-700
        bg-slate-950
        px-6
        py-10
        text-center
        transition
        hover:border-blue-500
        hover:bg-slate-900
      "
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-2xl">
        📄
      </div>

      <p className="mt-4 font-medium text-white">
        Choose a PDF document
      </p>

      <p className="mt-2 text-sm text-slate-500">
        PDF files only · Maximum size 10 MB
      </p>

      <span
        className="
          mt-5
          rounded-lg
          border
          border-slate-700
          px-4
          py-2
          text-sm
          font-medium
          text-slate-300
          transition
          hover:bg-slate-800
        "
      >
        Browse Files
      </span>

      <input
        ref={inputRef}
        id="pdf-upload"
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </label>

    {file && !loading && (
  <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">
          📄 {file.name}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </p>
      </div>

      <span className="shrink-0 text-xs font-medium text-green-400">
        Ready
      </span>
    </div>
  </div>
)}

{loading && (
  <div
    className="
      mt-5
      rounded-xl
      border
      border-blue-900
      bg-blue-950/40
      p-5
    "
  >
    <div className="flex items-center gap-4">
      <div
        className="
          h-8
          w-8
          animate-spin
          rounded-full
          border-4
          border-blue-900
          border-t-blue-400
        "
      />

      <div>
        <p className="font-medium text-white">
          Processing your document...
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Extracting text, creating chunks, and generating embeddings.
        </p>
      </div>
    </div>
  </div>
)}

    <div className="mt-5">
      <Button
        onClick={handleUpload}
        loading={loading}
        loadingText="Processing PDF..."
        disabled={!file}
      >
        Upload & Process
      </Button>
    </div>
  </Card>
);
}