import { misc } from "@/server/api/routers/misc"
import { plug } from "@/server/api/routers/plug"
import { socket } from "@/server/api/routers/socket"
import { createTRPCRouter } from "@/server/api/trpc"
import { jobs } from "./routers/jobs";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

export const appRouter = createTRPCRouter({
	misc,
	plug,
	socket,
	jobs
})

export type AppRouter = typeof appRouter

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
