import { config } from "dotenv"
import { z } from "zod"

import { createEnv } from "@t3-oss/env-nextjs"

config()

export const env = createEnv({
	server: {
		NEXT_AUTH_URL: z.string().startsWith("http"),
		NEXT_AUTH_SECRET: z.string(),
		DATABASE_URL: z.string().startsWith("postgresql://"),
		OPENSEA_KEY: z.string(),
		ZERION_KEY: z.string(),
		PORT: z.string().optional().default("3000").transform(Number),
		DOCKER_CONTAINER_NAME: z.string().optional().default("postgres"),
		DOCKER_DATABASE_NAME: z.string().optional().default("postgres"),
		DOCKER_DATABASE_PORT: z.string().optional().default("5434"),
		DOCKER_DATABASE_PASSWORD: z.string().optional().default("postgres")
	},
	client: {
		NEXT_PUBLIC_APP_URL: z.string().optional().default("http://localhost:3000"),
		NEXT_PUBLIC_WS_URL: z.string().optional().default("ws://localhost:3001"),
		NEXT_PUBLIC_EARLY_ACCESS: z.string().optional().default("false").transform(Boolean),
		NEXT_PUBLIC_WALLETCONNECT_ID: z.string(),
		NEXT_PUBLIC_ALCHEMY_KEY: z.string()
	},
	runtimeEnv: {
		NEXT_AUTH_URL: process.env.NEXT_AUTH_URL,
		NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
		OPENSEA_KEY: process.env.OPENSEA_KEY,
		ZERION_KEY: process.env.ZERION_KEY,
		PORT: process.env.PORT,
		DOCKER_CONTAINER_NAME: process.env.DOCKER_CONTAINER_NAME,
		DOCKER_DATABASE_NAME: process.env.DOCKER_DATABASE_NAME,
		DOCKER_DATABASE_PORT: process.env.DOCKER_DATABASE_PORT,
		DOCKER_DATABASE_PASSWORD: process.env.DOCKER_DATABASE_PASSWORD,
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
