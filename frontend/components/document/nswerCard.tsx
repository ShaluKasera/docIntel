import Card from "@/components/ui/Card";

type AnswerCardProps = {
  answer: string;
};

export default function AnswerCard({
  answer,
}: AnswerCardProps) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-white">
        Answer
      </h2>

      <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-300">
        {answer}
      </p>
    </Card>
  );
}