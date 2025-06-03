export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-zinc-800"></div>
      <p className="mt-4 text-zinc-400">Loading...</p>
    </div>
  );
} 