'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';

export function GuestbookForm() {
  const [message, setMessage] = useState('');
  const utils = trpc.useContext();
  
  const postMessage = trpc.guestbook.postMessage.useMutation({
    onSuccess: () => {
      setMessage('');
      utils.guestbook.getAll.invalidate();
    },
  });

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (message.trim()) {
          postMessage.mutate({ message });
        }
      }}
    >
      <input
        type="text"
        className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
        placeholder="Your message..."
        minLength={1}
        maxLength={100}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button
        type="submit"
        className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
        disabled={postMessage.isPending}
      >
        {postMessage.isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
} 