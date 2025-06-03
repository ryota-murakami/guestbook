'use client';

import { signIn } from 'next-auth/react';

export function SignInButton() {
  return (
    <button
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={() => signIn('github')}
    >
      Sign in with GitHub
    </button>
  );
} 