import { API_URL } from "@/lib/api";
import type {
  AskRequest,
  AskResponse,
  DocumentListResponse,
} from "@/types/document";



export async function askQuestion(
  request: AskRequest
): Promise<AskResponse> {
  const response = await fetch(
    `${API_URL}/api/v1/documents/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to get an answer."
    );
  }

  return data;
}


export async function getDocuments(): Promise<DocumentListResponse> {
  const response = await fetch(
    `${API_URL}/api/v1/documents`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to load documents."
    );
  }

  return data;
}

export async function deleteDocument(
  documentId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/v1/documents/${documentId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to delete document."
    );
  }
}