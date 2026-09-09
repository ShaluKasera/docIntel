"use client";
import { useState } from "react";
import QuestionForm from "@/components/document/QuestionForm";
import AnswerCard from "@/components/document/AnswerCard";
import SourceList from "@/components/document/SourceList";
import DocumentHeader from "@/components/document/DocumentHeader";

import type {
  AskResponse,
  Document,
} from "@/types/document";

type DocumentWorkspaceProps = {
  document: Document;
  response: AskResponse | null;
  onAnswer: (data: AskResponse) => void;
  onBack: () => void;
};

export default function DocumentWorkspace({
  document,
  response,
  onAnswer,
  onBack,
}: DocumentWorkspaceProps) {
  const [asking, setAsking] = useState(false);
  return (
    <section>
      <DocumentHeader
        document={document}
        onBack={onBack}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <QuestionForm
            documentId={document.id}
            onAnswer={onAnswer}
            onLoadingChange={setAsking}
          />
          {asking && (
            <div
              className="
                mt-6
                rounded-2xl
                border
                border-blue-900
                bg-blue-950/30
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
                    Finding the answer...
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Searching relevant document sections and asking the local AI model.
                  </p>
                </div>
              </div>
            </div>
          )}

          {response ? (
            <div className="mt-6 space-y-6">
              <AnswerCard answer={response.answer} />
              <SourceList sources={response.sources} />
            </div>
          ) : (
            <div
              className="
                mt-6
                rounded-2xl
                border
                border-dashed
                border-slate-800
                bg-slate-900/50
                p-10
                text-center
              "
            >
              <div className="text-4xl">
                💬
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                Ask your first question
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Ask DocIntel something about this document.
                The AI will retrieve relevant sections and use
                them to generate an answer.
              </p>
            </div>
          )}
        </div>

        <aside
          className="
            h-fit
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-5
          "
        >
          <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
            How it works
          </p>

          <h3 className="mt-1 text-lg font-semibold text-white">
            RAG Pipeline
          </h3>

          <div className="mt-5 space-y-4">
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-xs font-semibold text-blue-400">
                1
              </span>

              <div>
                <p className="text-sm font-medium text-white">
                  Ask a question
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your question is converted into an embedding.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-xs font-semibold text-blue-400">
                2
              </span>

              <div>
                <p className="text-sm font-medium text-white">
                  Retrieve context
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  pgvector finds the most relevant document chunks.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-xs font-semibold text-blue-400">
                3
              </span>

              <div>
                <p className="text-sm font-medium text-white">
                  Generate answer
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  The local LLM uses the retrieved context to answer.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}