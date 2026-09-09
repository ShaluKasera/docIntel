"use client";

import { useEffect, useState } from "react";

import DocumentList from "@/components/document/DocumentList";
import FileUpload from "@/components/document/FileUpload";
import DocumentWorkspace from "@/components/document/DocumentWorkspace";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getDocuments } from "@/services/documentService";
import type {
  AskResponse,
  Document,
} from "@/types/document";

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);

  const [selectedDocument, setSelectedDocument] =
    useState<Document | null>(null);

  const [response, setResponse] =
    useState<AskResponse | null>(null);

  const [loadingDocuments, setLoadingDocuments] =
    useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoadingDocuments(true);

      const data = await getDocuments();

      setDocuments(data.documents);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to load documents."
      );
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleSelectDocument = (document: Document) => {
    setSelectedDocument(document);
    setResponse(null);
  };

  const handleAnswer = (data: AskResponse) => {
    setResponse(data);
  };

  const handleBack = () => {
    setSelectedDocument(null);
    setResponse(null);
  };

  const handleDocumentDeleted = (
    documentId: string
  ) => {
    const deletedDocument = documents.find(
      (document) => document.id === documentId
    );

    setDocuments((currentDocuments) =>
      currentDocuments.filter(
        (document) => document.id !== documentId
      )
    );

    toast.success(
      deletedDocument
        ? `${deletedDocument.filename} deleted successfully.`
        : "Document deleted successfully."
    );

    if (selectedDocument?.id === documentId) {
      setSelectedDocument(null);
      setResponse(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <PageContainer>
        {!selectedDocument && (
          <section>
            <header className="mb-10 text-center">
              <h1 className="text-4xl font-bold tracking-tight">
                DocIntel
              </h1>

              <p className="mt-3 text-slate-400">
                AI-Powered Document Q&A
              </p>
            </header>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                Your Documents
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Select a document to start asking questions.
              </p>
            </div>

            {loadingDocuments ? (
              <LoadingSpinner text="Loading documents..." />
            ) : (
              <>
                <DocumentList
                  documents={documents}
                  onSelect={handleSelectDocument}
                  onDeleted={handleDocumentDeleted}
                />

                <div className="mt-6">
                  <FileUpload
                    onUploaded={loadDocuments}
                  />
                </div>
              </>
            )}
          </section>
        )}

        {selectedDocument && (
          <DocumentWorkspace
            document={selectedDocument}
            response={response}
            onAnswer={handleAnswer}
            onBack={handleBack}
          />
        )}
      </PageContainer>
    </main>
  );
}