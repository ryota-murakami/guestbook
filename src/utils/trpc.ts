/**
 * tRPC Client Utilities
 * この設定は、クライアント側からtRPC APIにクエリを実行するために使用されます
 */

import { createTRPCReact } from '@trpc/react-query'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'

import { type AppRouter } from '~/server/api/root'

/**
 * tRPCリアクトフックを作成
 */
export const trpc = createTRPCReact<AppRouter>()

/**
 * tRPCルーターの入力と出力の型を推論するためのユーティリティ
 * @example
 * type HelloInput = RouterInputs['example']['hello'];
 * type HelloOutput = RouterOutputs['example']['hello'];
 */
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
