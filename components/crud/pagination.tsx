import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  basePath,
  query,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  query: string;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(targetPage: number) {
    const params = new URLSearchParams(query);
    params.set("page", String(targetPage));
    return `${basePath}?${params.toString()}`;
  }

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav className="mt-4 flex items-center justify-between text-sm">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={isFirst}
        tabIndex={isFirst ? -1 : undefined}
        className={`rounded-md px-3 py-1.5 font-medium ${
          isFirst
            ? "pointer-events-none text-gray-300"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Previous
      </Link>
      <span className="text-gray-500">
        Page {page} of {totalPages}
      </span>
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={isLast}
        tabIndex={isLast ? -1 : undefined}
        className={`rounded-md px-3 py-1.5 font-medium ${
          isLast
            ? "pointer-events-none text-gray-300"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
