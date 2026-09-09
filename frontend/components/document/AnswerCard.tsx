import Card from "@/components/ui/Card";

type AnswerCardProps = {
  answer: string;
};

export default function AnswerCard({
  answer,
}: AnswerCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 text-lg">
          ✨
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
            AI Answer
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Based on your document
          </h2>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
        <p className="whitespace-pre-wrap leading-7 text-slate-300">
          {answer}
        </p>
      </div>
    </Card>
  );
}