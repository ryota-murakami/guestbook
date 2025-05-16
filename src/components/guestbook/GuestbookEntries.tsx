'use client';

import { trpc } from '@/utils/trpc';

type GuestbookEntry = {
  id: string;
  createdAt: Date;
  name: string;
  message: string;
};

export function GuestbookEntries({
  initialEntries,
}: {
  initialEntries: GuestbookEntry[];
}) {
  const { data: entries, isLoading, error } = trpc.guestbook.getAll.useQuery(undefined, {
    initialData: initialEntries,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading && !initialEntries.length) {
    return (
      <div className="text-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-zinc-800 mx-auto"></div>
        <p className="mt-2 text-zinc-400">Loading entries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading entries: {error.message}</p>
        <button 
          className="mt-2 px-4 py-2 bg-zinc-800 text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!entries?.length) {
    return (
      <div className="text-center p-4">
        <p className="text-zinc-400">No entries yet. Be the first to sign the guestbook!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry) => (
        <div key={entry.id} className="flex flex-col gap-2 rounded-md border-2 border-zinc-800 p-4">
          <div>
            <p className="font-bold">{entry.name}</p>
            <p className="text-sm text-zinc-400">
              {new Date(entry.createdAt).toLocaleDateString()}
            </p>
          </div>
          <p>{entry.message}</p>
        </div>
      ))}
    </div>
  );
} 