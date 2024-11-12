import Head from "next/head"

import { Blocks, Hero, LandingFooter, Light, Transactions, Vision } from "@/components"

const Page = () => (
	<>
		<Head>
			<title>&quot;If This, Then That&quot; for Ethereum transactions.</title>
		</Head>

		<div className="overflow-x-hidden">
			<Hero />
			<Transactions />
			<Blocks />
			<Vision />
			<LandingFooter />
		</div>
	</>
)

export default Page
