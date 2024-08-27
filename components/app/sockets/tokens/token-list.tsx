import { FC, HTMLAttributes, useMemo, useState } from "react"

import { motion, MotionProps } from "framer-motion"
import { SearchIcon } from "lucide-react"

import { Button, Search, SocketTokenItem } from "@/components"
import { useBalances, useSockets } from "@/contexts"
import { cn, greenGradientStyle } from "@/lib"
import { RouterOutputs } from "@/server/client"

export const SocketTokenList: FC<
	HTMLAttributes<HTMLDivElement> &
		MotionProps & {
			id: string
			tokens?: RouterOutputs["socket"]["balances"]["positions"]["tokens"]
			expanded?: boolean
			count?: number
			column?: boolean
		}
> = ({ id, tokens, expanded, count = 5, column = true, className, ...props }) => {
	const { anonymous } = useSockets()
	const { positions } = useBalances()
	const { tokens: apiTokens } = positions
	tokens = tokens ?? apiTokens

	const [search, handleSearch] = useState("")

	const visibleTokens = useMemo(() => {
		if (tokens === undefined) return Array(5).fill(undefined)

		const filteredTokens = tokens.filter(
			token =>
				token.name.toLowerCase().includes(search.toLowerCase()) ||
				token.symbol.toLowerCase().includes(search.toLowerCase()) ||
				token.implementations.some(implementation => implementation.contract.toLowerCase().includes(search.toLowerCase()))
		)

		if (expanded) return filteredTokens

		return filteredTokens.slice(0, count)
	}, [tokens, expanded, count, search])

	const isEmptySearch = useMemo(
		() => search !== "" && tokens && tokens.length !== 0 && visibleTokens.length === 0,
		[search, tokens, visibleTokens]
	)

	return (
		<div className={cn("flex h-full flex-col gap-2", className)} {...props}>
			{anonymous && (
				<div className="flex h-full flex-col items-center justify-center text-center font-bold">
					<p>You are anonymous.</p>
					<p className="max-w-[320px] opacity-40">To view the collectibles you are holding you must authenticate a wallet.</p>
				</div>
			)}

			{anonymous === false && column && (
				<Search
					className="mb-2"
					icon={<SearchIcon size={14} className="opacity-40" />}
					placeholder="Search tokens"
					search={search}
					handleSearch={handleSearch}
					clear
				/>
			)}

			<motion.div
				className="flex flex-col gap-2"
				initial="hidden"
				animate="visible"
				variants={{
					hidden: { opacity: 0 },
					visible: {
						opacity: 1,
						transition: {
							staggerChildren: 0.05
						}
					}
				}}
			>
				{visibleTokens.map((token, index) => (
					<SocketTokenItem key={index} id={id} token={token} />
				))}
			</motion.div>

			{isEmptySearch && (
				<div className="my-auto flex flex-col items-center text-center">
					<p className="font-bold">
						No results for &lsquo;
						<span
							style={{
								...greenGradientStyle
							}}
						>
							{search}
						</span>
						&rsquo;.
					</p>
					<p className="mb-4 max-w-[320px] opacity-60">Your search returned no results.</p>
					<Button sizing="sm" onClick={() => handleSearch("")}>
						Reset
					</Button>
				</div>
			)}
		</div>
	)
}
