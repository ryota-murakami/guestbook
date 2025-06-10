# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm run dev` - Start development server with Turbopack
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm postinstall` - Regenerate Prisma client (runs automatically after npm install)

### Testing and Quality
- `pnpm vitest --run` - Run unit tests (Vitest with jsdom)
- `pnpm run e2e` - Run end-to-end tests (Playwright)
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix ESLint issues automatically
- `pnpm run typecheck` - Run TypeScript type checking
- `pnpm run prettier` - Format code with Prettier

## Architecture

This is a T3 Stack guestbook application built with:
- **Next.js 15** with App Router (`src/app/`)
- **tRPC** for type-safe API routes (`src/server/api/`)
- **Prisma** with PostgreSQL for database
- **NextAuth.js** for authentication (Discord and GitHub)
- **TailwindCSS** for styling
- **React Query** for client-side state management

### Key Structure
- **tRPC routers**: `src/server/api/routers/` - Backend API logic
- **Database schema**: `prisma/schema.prisma` - Defines User, Account, Session, and Guestbook models
- **Environment config**: `src/env.mjs` - Type-safe environment variable validation
- **Client providers**: `src/app/providers.tsx` - Sets up tRPC, React Query, and NextAuth
- **Components**: `src/components/` - Organized by feature (auth/, guestbook/)

### Testing Setup
- Unit tests use Vitest with React Testing Library
- E2E tests use Playwright with auto-started dev server
- Test files located in `__tests__/` directories and `e2e/` folder

### Path Aliases
- `@/*` and `~/*` both resolve to `src/*`