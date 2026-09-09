type SuccessMessageProps = {
  message: string;
};

export default function SuccessMessage({
  message,
}: SuccessMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      className="
        rounded-xl
        border
        border-green-900
        bg-green-950
        p-4
        text-sm
        text-green-300
      "
    >
      {message}
    </div>
  );
}