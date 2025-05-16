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
  const { data: entries } = trpc.guestbook.getAll.useQuery(undefined, {
    initialData: initialEntries,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

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