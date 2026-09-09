export type Source = {
  chunk_id: number;
  document_id: string;
  page_number: number;
  content: string;
  score: number;
};

export type AskRequest = {
  document_id: string;
  question: string;
  limit?: number;
};

export type AskResponse = {
  question: string;
  answer: string;
  sources: Source[];
};

export type Document = {
  id: string;
  filename: string;
  file_size: number;
  total_pages: number;
  status: string;
  created_at: string;
};

export type DocumentListResponse = {
  documents: Document[];
};