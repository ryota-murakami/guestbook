# Next.js Pages Router to App Router Migration Plan

## Overview
This document outlines the plan to migrate the current T3 Stack-based Next.js application from Pages Router to App Router. The application is a guestbook that uses Next.js, tRPC, Prisma, and NextAuth for authentication.

## Current Codebase Analysis

### Project Structure
- Standard T3 App architecture with Pages Router
- `src/pages` contains page components and API routes
- `src/server` contains tRPC routers and server-side logic
- `prisma` directory with database schema for the guestbook
- Authentication handled through NextAuth

### Key Components
- **Pages**: Main page component rendering the guestbook interface
- **API Routes**: NextAuth and tRPC endpoints in `pages/api/`
- **tRPC Setup**: Server-side APIs handling guestbook operations
- **Prisma Models**: Primarily the Guestbook entry model

## Migration Requirements

### Next.js App Router Migration

1. **Directory Structure Changes**
   - Migrate from `/src/pages` to `/src/app` directory structure
   - Convert page files to use new `page.tsx` convention
   - Move layouts to dedicated `layout.tsx` files

2. **Route Handlers**
   - Convert API routes from `pages/api/*` to `app/api/*/route.ts` format
   - Implement the new Response/Request API instead of req/res

3. **Metadata and SEO**
   - Update metadata handling using new App Router metadata API
   - Configure static and dynamic metadata exports

4. **Server Components**
   - Convert appropriate components to React Server Components
   - Add `'use client'` directive to client components

### tRPC Integration

1. **tRPC Configuration**
   - Update tRPC configuration for App Router compatibility
   - Move tRPC API endpoint to new route handlers
   - Configure client-side data fetching with React Server Components

2. **Providers Setup**
   - Create appropriate provider structure for client components
   - Ensure proper data hydration between server and client

3. **Client Invocation**
   - Update how tRPC is invoked from client components
   - Handle server-side data prefetching

### Prisma Integration

1. **Database Client**
   - Update Prisma client instantiation for App Router
   - Ensure proper database connection management
   - Create appropriate utility functions for database access

### NextAuth (Auth.js) Integration

1. **Configuration**
   - Migrate from `pages/api/auth/[...nextauth].ts` to new Auth.js App Router format
   - Set up Session Provider for client components
   - Update session handling throughout the application

2. **Auth Hooks**
   - Update auth hooks and utilities to support App Router
   - Implement server-side session handling

## Step-by-Step Migration Plan

### Phase 1: Preparation

1. **Dependency Updates**
   - Update Next.js to version 14.x
   - Update tRPC, Prisma, and NextAuth to latest versions
   - Update other dependencies as needed

2. **Create App Directory Structure**
   - Set up `/src/app` directory
   - Prepare basic layout files and route structure

### Phase 2: Core Configuration

1. **App Router Setup**
   - Create root layout with HTML, body structure
   - Configure global providers
   - Set up metadata

2. **Auth.js Migration**
   - Create new Auth.js configuration for App Router
   - Set up session providers
   - Implement server-side session utilities

3. **tRPC API Routes**
   - Create new route handler for tRPC
   - Update tRPC configuration for App Router

### Phase 3: Page Migration

1. **Home Page Migration**
   - Convert index page to App Router format
   - Implement proper data fetching
   - Ensure authentication works correctly

2. **Additional Pages**
   - Migrate any additional pages to App Router format
   - Ensure consistent layout and styling

### Phase 4: Testing & Optimization

1. **Testing**
   - Verify all functionality works correctly
   - Test authentication flows
   - Ensure database operations work properly

2. **Performance Optimization**
   - Optimize server/client component boundaries
   - Implement proper caching strategies
   - Review and optimize data fetching patterns

## Technical Implementation Details

### App Router Structure

```
src/
  app/
    api/
      auth/
        [...nextauth]/
          route.ts
      trpc/
        [trpc]/
          route.ts
    layout.tsx
    page.tsx
    providers.tsx  (client-side providers)
```

### tRPC Implementation

Server-side setup:
```typescript
// src/server/api/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { getServerAuthSession } from '@/server/auth';
import { prisma } from '@/server/db';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();
  return {
    prisma,
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
```

API Route handler:
```typescript
// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
  });

export { handler as GET, handler as POST };
```

### NextAuth (Auth.js) Implementation

```typescript
// src/server/auth.ts
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getServerSession, type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { prisma } from '@/server/db';
import { env } from '@/env.mjs';

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
```

Route handler:
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/server/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Client-Side Providers

```typescript
// src/app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/utils/trpc';
import superjson from 'superjson';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>{children}</SessionProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

## Testing Strategy

1. **Unit Testing**
   - Test individual API routes
   - Test tRPC procedures
   - Test authentication flows

2. **Integration Testing**
   - Test full user flows
   - Verify client-server interactions
   - Test database operations

3. **End-to-End Testing**
   - Test complete application functionality
   - Verify all pages and routes work correctly
   - Test authentication and authorization

## Migration Risks and Mitigations

1. **Data Integrity**
   - Risk: Database schema changes during migration
   - Mitigation: Ensure Prisma migrations are properly planned and tested

2. **Authentication Flow Disruption**
   - Risk: Users losing sessions during deployment
   - Mitigation: Ensure auth cookie format remains compatible or provide clear re-login instructions

3. **Performance Regression**
   - Risk: Inappropriate server/client component boundaries causing performance issues
   - Mitigation: Carefully design component boundaries and measure performance metrics

## Conclusion

This migration plan provides a structured approach to moving the guestbook application from Next.js Pages Router to App Router. By following this phased approach, we can ensure a smooth transition while maintaining all existing functionality and potentially gaining performance benefits from React Server Components. 