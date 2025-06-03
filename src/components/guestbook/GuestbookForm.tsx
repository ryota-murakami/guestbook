'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';

export function GuestbookForm() {
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const utils = trpc.useContext();
  
  const postMessage = trpc.guestbook.postMessage.useMutation({
    onSuccess: () => {
      setMessage('');
      setErrorMessage(null);
      utils.guestbook.getAll.invalidate();
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  return (
    <div className="w-full max-w-md">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{errorMessage}</p>
          <button 
            className="text-sm underline mt-1"
            onClick={() => setErrorMessage(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (message.trim()) {
            postMessage.mutate({ message });
          } else {
            setErrorMessage('Message cannot be empty');
          }
        }}
      >
        <input
          type="text"
          className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none flex-grow"
          placeholder="Your message..."
          minLength={1}
          maxLength={100}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button
          type="submit"
          className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none whitespace-nowrap"
          disabled={postMessage.isPending}
        >
          {postMessage.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
} 