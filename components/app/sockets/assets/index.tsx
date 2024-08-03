"use client"

import { FC, HTMLAttributes, useState } from "react"

import { CircleDollarSign, ImageIcon } from "lucide-react"

import { Header, SocketCollectionList, SocketTokenList } from "@/components"

export const SocketAssets: FC<HTMLAttributes<HTMLDivElement>> = ({
	...props
}) => {
	const [tokensExpanded, setTokensExpanded] = useState(false)

	return (
		<div {...props}>
			<Header
				size="md"
				icon={<CircleDollarSign size={14} className="opacity-40" />}
				label="Tokens"
				nextLabel={tokensExpanded ? "Collapse" : "See All"}
				nextOnClick={() => setTokensExpanded(!tokensExpanded)}
			/>
			<SocketTokenList expanded={tokensExpanded} />

			<Header
				size="md"
				icon={<ImageIcon size={14} className="opacity-40" />}
				label="Collectibles"
			/>
			<SocketCollectionList />

			{/* <Footer>
				<Button
					className="w-full"
					onClick={() => handleFrameVisible("transfer")}
				>
					Transfer
				</Button>
			</Footer>

			<TransferFrame /> */}
		</div>
	)
}
