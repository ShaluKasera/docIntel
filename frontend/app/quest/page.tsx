"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import { API_URL } from "@/lib/api";
import type { AskResponse } from "@/types/document";

type QuestionFormProps = {
  onAnswer: (data: AskResponse) => void;
  onError: (message: string) => void;
};

export default function QuestionForm({
  onAnswer,
  onError,
}: QuestionFormProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) {
      onError("Please enter a question.");
      return;
    }

    setLoading(true);
    onError("");

    try {
      const response = await fetch(
        `${API_URL}/api/v1/documents/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.trim(),
            limit: 5,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to get an answer."
        );
      }

      onAnswer(data);
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <label className="mb-3 block text-sm font-medium text-white">
        Ask a question about your document
      </label>

      <Textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="What is a virtual function?"
        rows={4}
      />

      <div className="mt-4">
        <Button
          onClick={handleAsk}
          loading={loading}
        >
          Ask Question
        </Button>
      </div>
    </Card>
  );
}