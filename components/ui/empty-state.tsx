export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-[10px] border border-dashed border-gray-200 text-center text-sm text-gray-400">
      {message}
    </div>
  );
}
