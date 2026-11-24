// Suspense fallback shown while a lazy route chunk loads.
export function RouteLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="font-display text-2xl text-amber-500 italic animate-pulse">
        Schedully
      </span>
    </div>
  );
}
