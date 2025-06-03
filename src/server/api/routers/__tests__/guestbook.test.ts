import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the env module
vi.mock('@/env.mjs', () => ({
  env: {
    DISCORD_CLIENT_ID: 'mock-discord-id',
    DISCORD_CLIENT_SECRET: 'mock-discord-secret',
    GITHUB_CLIENT_ID: 'mock-github-id',
    GITHUB_CLIENT_SECRET: 'mock-github-secret',
    NEXTAUTH_SECRET: 'mock-nextauth-secret',
    NEXTAUTH_URL: 'http://localhost:3000',
    DATABASE_URL: 'mock-database-url',
  },
}))

// Mock the auth module
vi.mock('@/server/auth', () => ({
  getServerAuthSession: vi.fn(),
}))

// Prisma clientのモック
vi.mock('@/server/db', () => ({
  prisma: {
    guestbook: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}))

// モックされたPrisma clientをインポート
import { appRouter } from '@/server/api/root'
import { createCallerFactory } from '@/server/api/trpc'
import { prisma } from '@/server/db'

describe('guestbook router', () => {
  const createCaller = createCallerFactory(appRouter)

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getAll', () => {
    it('should return all guestbook entries', async () => {
      const mockEntries = [
        { id: '1', message: 'Hello', name: 'Test User', createdAt: new Date() },
      ]

      ;(prisma.guestbook.findMany as any).mockResolvedValue(mockEntries)

      const caller = createCaller({
        prisma,
        session: null,
        headers: new Headers(),
      })

      const result = await caller.guestbook.getAll()

      expect(result).toEqual(mockEntries)
      expect(prisma.guestbook.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should handle errors', async () => {
      ;(prisma.guestbook.findMany as any).mockRejectedValue(
        new Error('Database error'),
      )

      const caller = createCaller({
        prisma,
        session: null,
        headers: new Headers(),
      })

      await expect(caller.guestbook.getAll()).rejects.toThrow(
        'Failed to fetch guestbook entries',
      )
    })
  })

  describe('postMessage', () => {
    it('should create a new guestbook entry', async () => {
      const mockEntry = {
        id: '1',
        message: 'Test message',
        name: 'Test User',
        createdAt: new Date(),
      }
      ;(prisma.guestbook.create as any).mockResolvedValue(mockEntry)

      const caller = createCaller({
        prisma,
        session: {
          user: { id: 'user1', name: 'Test User' },
          expires: new Date().toISOString(),
        } as any,
        headers: new Headers(),
      })

      const result = await caller.guestbook.postMessage({
        message: 'Test message',
      })

      expect(result).toEqual(mockEntry)
      expect(prisma.guestbook.create).toHaveBeenCalledWith({
        data: {
          message: 'Test message',
          name: 'Test User',
        },
      })
    })

    it('should use "Anonymous" when user name is not available', async () => {
      const mockEntry = {
        id: '1',
        message: 'Test message',
        name: 'Anonymous',
        createdAt: new Date(),
      }
      ;(prisma.guestbook.create as any).mockResolvedValue(mockEntry)

      const caller = createCaller({
        prisma,
        session: {
          user: { id: 'user1', name: null },
          expires: new Date().toISOString(),
        } as any,
        headers: new Headers(),
      })

      await caller.guestbook.postMessage({ message: 'Test message' })

      expect(prisma.guestbook.create).toHaveBeenCalledWith({
        data: {
          message: 'Test message',
          name: 'Anonymous',
        },
      })
    })

    it('should handle errors', async () => {
      ;(prisma.guestbook.create as any).mockRejectedValue(
        new Error('Database error'),
      )

      const caller = createCaller({
        prisma,
        session: {
          user: { id: 'user1', name: 'Test User' },
          expires: new Date().toISOString(),
        } as any,
        headers: new Headers(),
      })

      await expect(
        caller.guestbook.postMessage({ message: 'Test message' }),
      ).rejects.toThrow('Failed to post message')
    })
  })
})
