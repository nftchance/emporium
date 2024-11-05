import { config } from "dotenv"
import { z } from "zod"

import { createEnv } from "@t3-oss/env-nextjs"

config()

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().startsWith("postgresql://"),
		SOLVER_URL: z.string().startsWith("http"),
		NEXTAUTH_URL: z.string().startsWith("http"),
		NEXTAUTH_SECRET: z.string(),
		OPENSEA_KEY: z.string(),
		ZERION_KEY: z.string(),
		PORT: z.string().optional().default("3000").transform(Number),
		DOCKER_CONTAINER_NAME: z.string().optional().default("postgres"),
		DOCKER_DATABASE_NAME: z.string().optional().default("postgres"),
		DOCKER_DATABASE_PORT: z.string().optional().default("5434"),
		DOCKER_DATABASE_PASSWORD: z.string().optional().default("postgres"),
		ADMIN_API_KEY: z.string()
	},
	client: {
		NEXT_PUBLIC_APP_URL: z.string().optional().default("http://localhost:3000"),
		NEXT_PUBLIC_WS_URL: z.string().optional().default("ws://localhost:3001"),
		NEXT_PUBLIC_EARLY_ACCESS: z
			.string()
			.optional()
			.default("true")
			.transform(val => val === "true"),
		NEXT_PUBLIC_WALLETCONNECT_ID: z.string(),
		NEXT_PUBLIC_ALCHEMY_KEY: z.string()
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		SOLVER_URL: process.env.SOLVER_URL,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		OPENSEA_KEY: process.env.OPENSEA_KEY,
		ZERION_KEY: process.env.ZERION_KEY,
		PORT: process.env.PORT,
		DOCKER_CONTAINER_NAME: process.env.DOCKER_CONTAINER_NAME,
		DOCKER_DATABASE_NAME: process.env.DOCKER_DATABASE_NAME,
		DOCKER_DATABASE_PORT: process.env.DOCKER_DATABASE_PORT,
		DOCKER_DATABASE_PASSWORD: process.env.DOCKER_DATABASE_PASSWORD,
		ADMIN_API_KEY: process.env.ADMIN_API_KEY,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
		NEXT_PUBLIC_EARLY_ACCESS: process.env.NEXT_PUBLIC_EARLY_ACCESS,
		NEXT_PUBLIC_WALLETCONNECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
		NEXT_PUBLIC_ALCHEMY_KEY: process.env.NEXT_PUBLIC_ALCHEMY_KEY
	},
	emptyStringAsUndefined: true,
	isServer: typeof window === "undefined",
	skipValidation: process.env.GITHUB_ACTIONS === "true"
})
