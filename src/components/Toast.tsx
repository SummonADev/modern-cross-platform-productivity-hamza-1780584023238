type ToastProps = { message: string | null };

export default function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 cozy-pop">
      <div className="cozy-card px-5 py-3 flex items-center gap-2 shadow-lg">
        <span className="text-2xl">🌿</span>
        <span className="text-bark font-semibold">{message}</span>
      </div>
    </div>
  );
}
