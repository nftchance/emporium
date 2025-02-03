import { NextApiRequest } from "next"
import { type Session } from "next-auth"

import { initTRPC, TRPCError } from "@trpc/server"
import { type CreateNextContextOptions } from "@trpc/server/adapters/next"

import { type IncomingHttpHeaders } from "http"
import superjson from "superjson"
import { ZodError } from "zod"

import { env } from "@/env"
import { getServerAuthSession } from "@/server/auth"
import type { Context } from "@/server/context"
import { db } from "@/server/db"
import { emitter } from "@/server/emitter"

interface CreateContextOptions {
	session: Session | null
	headers?: NextApiRequest["headers"]
}

export const createInnerTRPCContext = ({ session, headers }: CreateContextOptions) => {
	return {
		session,
		db,
		emitter,
		headers
	}
}

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
	const { req, res } = opts
	const session = await getServerAuthSession({ req, res })

	return createInnerTRPCContext({
		session,
		headers: req.headers
	})
}

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
			}
		}
	}
})
export const createTRPCRouter = t.router

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(
	t.middleware(({ ctx, next }) => {
		if (!ctx.session?.user)
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "isAuthenticated() failed"
			})

		if (!ctx.session?.address || ctx.session.address.startsWith("0x") === false || ctx.session.user.anonymous)
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "isNonAnonymousAuthenticated() failed"
			})

		return next({
			ctx: {
				session: {
					...ctx.session,
					address: ctx.session.address,
					user: ctx.session.user
				}
			}
		})
	})
)

export const apiKeyProcedure = publicProcedure.use(
	t.middleware(({ ctx, next }) => {
		const apiKey = ctx.headers?.["x-api-key"]
		if (!apiKey) {
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "Missing API key"
			})
		}

		return next()
	})
)

export const anonymousProtectedProcedure = publicProcedure.use(
	t.middleware(({ ctx, next }) => {
		if (!ctx.session?.user)
			throw new TRPCError({
				code: "UNAUTHORIZED",
				message: "isAuthenticated() failed"
			})

		return next({
			ctx: {
				session: {
					...ctx.session,
					user: ctx.session.user
				}
			}
		})
	})
)
