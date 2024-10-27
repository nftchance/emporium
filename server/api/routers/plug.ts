import { anonymousProtectedProcedure, createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { observable } from "@trpc/server/observable"

import { z } from "zod"

import { Prisma } from "@prisma/client"

import { colors } from "@/lib"

import { action as actionRouter } from "./action"

const workflow = Prisma.validator<Prisma.WorkflowDefaultArgs>()({})
export type Workflow = Prisma.WorkflowGetPayload<typeof workflow>

export const events = {
	add: "add-plug",
	rename: "rename-plug",
	edit: "edit-plug",
	delete: "delete-plug",
	queue: "queue-plug"
} as const

const subscription = (event: string) =>
	anonymousProtectedProcedure.subscription(async ({ ctx }) => {
		return observable<Workflow>(emit => {
			const handleSubscription = (data: Workflow) => {
				emit.next(data)
			}

			ctx.emitter.on(event, handleSubscription)

			return () => ctx.emitter.off(event, handleSubscription)
		})
	})

export const plug = createTRPCRouter({
	get: publicProcedure.input(z.array(z.string())).query(async ({ input, ctx }) => {
		console.log(ctx?.session?.user)
		return await ctx.db.workflow.findMany({
			where: {
				id: { in: input },
				isPrivate: false
			}
		})
	}),
	infinite: anonymousProtectedProcedure
		.input(
			z.object({
				address: z.string().optional(),
				cursor: z.string().nullish(),
				limit: z.number().optional().default(10),
				search: z.string().optional(),
				tag: z.string().optional()
			})
		)
		.query(async ({ input, ctx }) => {
			const { cursor, search, tag } = input

			const mine = input.address === ctx.session.address

			const sessionWhere =
				mine === true
					? {
							socketId: ctx.session.address
						}
					: {
							isPrivate: false,
							isCurated: false,
							socketId: {
								not: ctx.session.address
							},
							actions: { not: "[]" }
						}

			const count = await ctx.db.workflow.count({
				where: {
					name: search
						? {
								contains: search,
								mode: "insensitive",
								not: mine ? undefined : "Untitled Plug"
							}
						: {
								not: mine ? undefined : "Untitled Plug"
							},
					tags: tag
						? {
								has: tag
							}
						: undefined,
					...sessionWhere
				}
			})

			const plugs = await ctx.db.workflow.findMany({
				where: {
					name: search
						? {
								contains: search,
								mode: "insensitive",
								not: mine ? undefined : "Untitled Plug"
							}
						: {
								not: mine ? undefined : "Untitled Plug"
							},
					tags: tag
						? {
								has: tag
							}
						: undefined,
					...sessionWhere
				},
				cursor: cursor ? { id: cursor } : undefined,
				take: input.limit + 1,
				orderBy: { createdAt: "asc" }
			})

			let nextCursor: typeof cursor | undefined = undefined
			if (plugs.length > input.limit) {
				const nextItem = plugs.pop()
				nextCursor = nextItem!.id
			}

			return {
				plugs: plugs,
				nextCursor,
				count
			}
		}),

	all: anonymousProtectedProcedure
		.input(
			z.object({
				target: z.union([z.literal("mine"), z.literal("others"), z.literal("curated")]),
				search: z.string().optional(),
				tag: z.string().optional(),
				limit: z.number().optional()
			})
		)
		.query(async ({ input, ctx }) => {
			try {
				if (input.target === "mine")
					return await ctx.db.workflow.findMany({
						where: {
							socketId: ctx.session.address
						},
						take: input.limit ? input.limit : undefined,
						orderBy: {
							updatedAt: "desc"
						}
					})

				if (input.target === "curated")
					return await ctx.db.workflow.findMany({
						where: {
							isPrivate: false,
							isCurated: true,
							actions: { not: "[]" }
						},
						take: input.limit ? input.limit : undefined,
						orderBy: {
							updatedAt: "desc"
						}
					})

				return await ctx.db.workflow.findMany({
					where: {
						isPrivate: false,
						socketId: {
							not: ctx.session.address
						},
						actions: { not: "[]" }
					},
					take: input.limit ? input.limit : undefined,
					orderBy: {
						updatedAt: "desc"
					}
				})
			} catch (error) {
				throw new TRPCError({ code: "BAD_REQUEST" })
			}
		}),
	add: anonymousProtectedProcedure
		.input(z.object({ index: z.number().optional(), from: z.string().optional() }).optional())
		.mutation(async ({ input, ctx }) => {
			try {
				const plug = await ctx.db.workflow.create({
					data: {
						name: "Untitled Plug",
						socketId: ctx.session.address,
						color: Object.keys(colors)[
							Math.floor(Math.random() * Object.keys(colors).length)
						] as keyof typeof colors
					}
				})

				ctx.emitter.emit(events.add, plug)

				return { plug, index: input?.index, from: input?.from }
			} catch (error) {
				throw new TRPCError({ code: "BAD_REQUEST" })
			}
		}),
	fork: anonymousProtectedProcedure
		.input(z.object({ plug: z.string(), index: z.number(), from: z.string() }))
		.mutation(async ({ input, ctx }) => {
			try {
				const forking = await ctx.db.workflow.findUnique({
					where: { id: input.plug }
				})

				if (forking == null) throw new TRPCError({ code: "BAD_REQUEST" })

				const { id, ...forkingData } = forking

				const plug = await ctx.db.workflow.create({
					data: {
						...forkingData,
						name: forking.name,
						socketId: ctx.session.address
					}
				})

				ctx.emitter.emit(events.add, plug)

				return { plug, index: input.index, from: input.from }
			} catch (error) {
				throw new TRPCError({ code: "BAD_REQUEST" })
			}
		}),
	edit: anonymousProtectedProcedure
		.input(
			z.object({
				id: z.string().optional(),
				name: z.string(),
				color: z.string(),
				isPrivate: z.boolean()
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				if (input.id === undefined) throw new TRPCError({ code: "BAD_REQUEST" })

				const { id, ...data } = input

				const plug = await ctx.db.workflow.update({
					where: {
						id,
						socketId: ctx.session.address
					},
					data
				})

				ctx.emitter.emit(events.edit, plug)

				return plug
			} catch (error) {
				throw new TRPCError({ code: "BAD_REQUEST" })
			}
		}),
	delete: anonymousProtectedProcedure
		.input(z.object({ plug: z.string(), index: z.number(), from: z.string().nullish() }))
		.mutation(async ({ input, ctx }) => {
			const plug = await ctx.db.workflow.delete({
				where: {
					id: input.plug,
					socketId: ctx.session.address
				}
			})

			ctx.emitter.emit(events.delete, plug)

			return { plug, index: input.index, from: input.from }
		}),
	onAdd: subscription(events.add),
	onEdit: subscription(events.edit),
	onDelete: subscription(events.delete),

	action: actionRouter
})
