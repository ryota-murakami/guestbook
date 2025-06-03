'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="mt-4 text-zinc-400">{error.message}</p>
      <button
        className="mt-4 rounded-md bg-zinc-800 px-4 py-2 text-white"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  )
}
