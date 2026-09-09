type LoadingSpinnerProps = {
  text?: string;
};

export default function LoadingSpinner({
  text = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div
        className="
          h-8
          w-8
          animate-spin
          rounded-full
          border-4
          border-slate-700
          border-t-blue-500
        "
      />

      <p className="mt-4 text-sm text-slate-400">
        {text}
      </p>
    </div>
  );
}