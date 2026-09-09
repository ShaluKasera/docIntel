type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({
  message,
}: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="
        rounded-xl
        border
        border-red-900
        bg-red-950
        p-4
        text-sm
        text-red-300
      "
    >
      {message}
    </div>
  );
}