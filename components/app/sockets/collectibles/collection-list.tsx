import { FC, HTMLAttributes, useMemo, useState } from "react"

import { SearchIcon } from "lucide-react"

import { Callout, CollectibleFrame, Search, SocketCollectionItem } from "@/components"
import { cn } from "@/lib"
import { RouterOutputs } from "@/server/client"
import { useColumns, useHoldings, useSocket } from "@/state"

export const SocketCollectionList: FC<
	HTMLAttributes<HTMLDivElement> & {
		index: number
		columnCollectibles?: RouterOutputs["socket"]["balances"]["collectibles"]
		expanded?: boolean
		count?: number
		isColumn?: boolean
	}
> = ({ index, columnCollectibles, expanded, count = 5, isColumn = true, className, ...props }) => {
	const { isAnonymous, socket } = useSocket()
	const { column, isExternal } = useColumns(index)
	const { collectibles: apiCollectibles } = useHoldings(column?.viewAs?.socketAddress ?? socket?.socketAddress)

	const collectibles = columnCollectibles ?? apiCollectibles

	const [search, handleSearch] = useState("")

	const visibleCollectibles: RouterOutputs["socket"]["balances"]["collectibles"] | Array<undefined> = useMemo(() => {
		if (
			collectibles === undefined ||
			(isAnonymous && isExternal === false) ||
			(search === "" && collectibles.length === 0)
		)
			return Array(5).fill(undefined)

		const filteredCollectibles = collectibles.filter(
			collectible =>
				collectible.name.toLowerCase().includes(search.toLowerCase()) ||
				collectible.description.toLowerCase().includes(search.toLowerCase()) ||
				collectible.collectibles.some(collectionCollectible =>
					(collectionCollectible.name ?? "").toLowerCase().includes(search.toLowerCase())
				)
		)

		if (expanded) return filteredCollectibles

		return filteredCollectibles.slice(0, count)
	}, [isAnonymous, isExternal, collectibles, expanded, count, search])

	return (
		<div className={cn("flex h-full flex-col gap-2", className)} {...props}>
			{(isAnonymous === false || isExternal) && isColumn && collectibles && collectibles.length > 0 && (
				<Search
					className="mb-2"
					icon={<SearchIcon size={14} className="opacity-40" />}
					placeholder="Search collectibles"
					search={search}
					handleSearch={handleSearch}
					clear
				/>
			)}

			<Callout.EmptySearch
				isEmpty={search !== "" && visibleCollectibles.length === 0}
				search={search}
				handleSearch={handleSearch}
			/>

			<div className="flex flex-col gap-2">
				{visibleCollectibles.map((collection, collectionIndex) => (
					<SocketCollectionItem
						key={collectionIndex}
						index={index}
						collection={collection}
						searched={false}
					/>
				))}
			</div>

			<Callout.Anonymous index={index} viewing="collectibles" isAbsolute={true} />
			<Callout.EmptyAssets
				index={index}
				isEmpty={!isAnonymous && search === "" && collectibles.length === 0}
				isViewing="collectibles"
				isReceivable={true}
			/>

			{visibleCollectibles.map(
				collection =>
					collection &&
					collection.collectibles.map(collectible => (
						<CollectibleFrame
							key={`${collection.address}-${collection.chain}-${collectible.tokenId}`}
							index={index}
							collection={collection}
							collectible={collectible}
						/>
					))
			)}
		</div>
	)
}
