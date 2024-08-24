import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { getDominantColor } from "@/server/color"

export const misc = createTRPCRouter({
	featureRequest: protectedProcedure
		.input(
			z.object({ context: z.string(), message: z.string().optional() })
		)
		.mutation(async ({ input, ctx }) => {
			return await ctx.db.featureRequest.create({
				data: {
					userAddress: ctx.session.address,
					context: input.context,
					message: input.message
				}
			})
		}),
	search: protectedProcedure
		.input(z.string().optional())
		.query(async ({ input, ctx }) => {
			// TODO: Handle private plugs and exclude them while combining the self-results.
			const plugs = await ctx.db.workflow.findMany({
				where: {
					name: {
						contains: input,
						mode: "insensitive",
						notIn: ["Untitled Plug", ""]
					}
				},
				orderBy: { updatedAt: "desc" }
			})

			// const balances = await ctx.db.tokenBalance.findMany({
			// 	where: {
			// 		AND: [
			// 			{
			// 				OR: [
			// 					{
			// 						name: {
			// 							contains: input,
			// 							mode: "insensitive"
			// 						}
			// 					},
			// 					{
			// 						symbol: {
			// 							contains: input,
			// 							mode: "insensitive"
			// 						}
			// 					}
			// 				]
			// 			},
			// 			{
			// 				cacheSocketId: ctx.session.address
			// 			}
			// 		]
			// 	}
			// })

			// const tokens = await aggregateTokensByChain(balances)

			const collectibles = await ctx.db.openseaCollection.findMany({
				where: {
					AND: [
						{
							OR: [
								{
									collectibles: {
										some: {
											cacheSocketId: ctx.session.address,
											OR: [
												{
													name: {
														contains: input,
														mode: "insensitive"
													}
												},
												{
													description: {
														contains: input,
														mode: "insensitive"
													}
												},
												{
													cacheChain: {
														contains: input,
														mode: "insensitive"
													}
												}
											]
										}
									}
								},
								{
									name: {
										contains: input,
										mode: "insensitive"
									}
								}
							]
						},
						{
							collectibles: {
								some: {
									cacheSocketId: ctx.session.address
								}
							}
						}
					]
				},
				include: {
					collectibles: {
						where: {
							cacheSocketId: ctx.session.address,
							OR: [
								{
									name: {
										contains: input,
										mode: "insensitive"
									}
								},
								{
									description: {
										contains: input,
										mode: "insensitive"
									}
								},
								{
									cacheChain: {
										contains: input,
										mode: "insensitive"
									}
								}
							]
						}
					}
				},
				orderBy: { createdAt: "desc" }
			})

			return {
				plugs,
				tokens: [],
				collectibles
			}
		}),
	extractDominantColor: protectedProcedure
		.input(z.string())
		.query(async ({ input }) => {
			return await getDominantColor(input)
		})
})
