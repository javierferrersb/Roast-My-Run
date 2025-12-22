/**
 * ErrorAlert Component
 *
 * Displays error messages
 */
interface ErrorAlertProps {
  message: string | null;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="border-4 border-black bg-red-600 px-6 py-4">
      <p className="font-mono font-black text-white">❌ {message}</p>
    </div>
  );
}
