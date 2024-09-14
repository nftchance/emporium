import { appRouter } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"
import { createNextApiHandler } from "@trpc/server/adapters/next"

export default createNextApiHandler({
	router: appRouter,
	createContext: createTRPCContext,
	onError:
		process.env.NODE_ENV === "development"
			? ({ path, error }) => {
					console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`)
				}
			: undefined
})
