export const PAGE_SIZE = 10;

/** Strips characters that are meaningful in a PostgREST `.or()` filter
 * string (`,`, `(`, `)`) so a search term can't break out of the filter
 * grammar it gets interpolated into. */
export function sanitizeSearchTerm(term: string): string {
  return term.replace(/[,()]/g, "").trim();
}

export function parsePage(value: string | undefined): number {
  const page = Number(value);
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
}
