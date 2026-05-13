export default function StatusMessage({
  status = "success",
  message,
}: {
  status?: "success" | "error";
  message?: string;
}) {
  if (!message) return;

  if (status === "success") {
    return <p className="bg-green-800 rounded-sm p-2 break-all">{message}</p>;
  }

  return <p className="bg-destructive rounded-sm p-2 break-all">{message}</p>;
}
