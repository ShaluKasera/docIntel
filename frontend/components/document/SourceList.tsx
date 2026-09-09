import Card from "@/components/ui/Card";
import type { Source } from "@/types/document";

type SourceListProps = {
  sources: Source[];
};

export default function SourceList({
  sources,
}: SourceListProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <Card>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
          Retrieved Context
        </p>

        <h2 className="mt-1 text-xl font-semibold text-white">
          Sources from your document
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          These document sections were used to generate the answer.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {sources.map((source, index) => (
          <div
            key={source.chunk_id}
            className="
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              p-5
            "
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-600/20
                    text-sm
                    font-semibold
                    text-blue-400
                  "
                >
                  {index + 1}
                </span>

                <div>
                  <p className="text-sm font-medium text-white">
                    Document source
                  </p>

                  <p className="text-xs text-slate-500">
                    Page {source.page_number}
                  </p>
                </div>
              </div>

              <span
                className="
                  rounded-full
                  border
                  border-slate-800
                  px-3
                  py-1
                  text-xs
                  text-slate-500
                "
              >
                Score {source.score.toFixed(3)}
              </span>
            </div>

            <div className="mt-4 border-l-2 border-slate-800 pl-4">
              <p className="text-sm leading-6 text-slate-400">
                {source.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}