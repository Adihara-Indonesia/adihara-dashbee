export function PageLoading({ cards = 2 }: { cards?: number }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6" role="status" aria-label="Loading">
        <div className="h-6 w-32 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: cards }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-white p-6 ring-1 ring-gray-200"
            >
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="mt-4 h-8 w-1/2 rounded bg-gray-200" />
              <div className="mt-6 h-32 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
