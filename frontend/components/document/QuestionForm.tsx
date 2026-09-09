"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import { askQuestion } from "@/services/documentService";
import { toast } from "sonner";
import type { AskResponse } from "@/types/document";

type QuestionFormProps = {
  documentId: string;
  onAnswer: (data: AskResponse) => void;
  onLoadingChange?: (loading: boolean) => void;
};

export default function QuestionForm({
  documentId,
  onAnswer,
  onLoadingChange,
}: QuestionFormProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    setLoading(true);
    onLoadingChange?.(true);

    try {
      const data = await askQuestion({
        document_id: documentId,
        question: question.trim(),
        limit: 5,
      });

      onAnswer(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

    return (
        <Card>
            <div className="mb-4">
                <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
                    Ask DocIntel
                </p>

                <label className="mt-1 block text-lg font-semibold text-white">
                    Ask a question about your document
                </label>

                <p className="mt-2 text-sm text-slate-500">
                    Ask questions using the information contained in the uploaded document.
                </p>
            </div>

            <Textarea value={question}
                onChange={
                    (event) => setQuestion(event.target.value)
                }
                placeholder="e.g. What are the main concepts explained in this document?"
                rows={4}/>
            <div className="mt-3 flex flex-wrap gap-2">
                <button type="button"
                    onClick={
                        () => setQuestion("What are the main concepts explained in this document?")
                    }
                    className="
                              rounded-lg
                              border
                              border-slate-800
                              px-3
                              py-2
                              text-xs
                              text-slate-400
                              transition
                              hover:border-slate-700
                              hover:bg-slate-800
                              hover:text-white
                            ">
                    Main concepts
                </button>

                <button type="button"
                    onClick={
                        () => setQuestion("Summarize this document.")
                    }
                    className="
                              rounded-lg
                              border
                              border-slate-800
                              px-3
                              py-2
                              text-xs
                              text-slate-400
                              transition
                              hover:border-slate-700
                              hover:bg-slate-800
                              hover:text-white
                            ">
                    Summarize
                </button>

                <button type="button"
                    onClick={
                        () => setQuestion("What are the most important points in this document?")
                    }
                    className="
                              rounded-lg
                              border
                              border-slate-800
                              px-3
                              py-2
                              text-xs
                              text-slate-400
                              transition
                              hover:border-slate-700
                              hover:bg-slate-800
                              hover:text-white
                            ">
                    Important points
                </button>
            </div>

            <div className="mt-4">
                <Button onClick={handleAsk}
                    loading={loading}
                    loadingText="Thinking...">
                    Ask Question
                </Button>
            </div>
        </Card>
    );
}
