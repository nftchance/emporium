import { FC, HTMLAttributes, useMemo, useState } from "react"

import { SearchIcon } from "lucide-react"

import { Animate, Callout, CollectibleFrame, Search, SocketCollectionItem } from "@/components"
import { useSockets } from "@/contexts"
import { cn } from "@/lib"
import { api, RouterOutputs } from "@/server/client"

export const SocketCollectionList: FC<
	HTMLAttributes<HTMLDivElement> & {
		id: string
		collectibles?: RouterOutputs["socket"]["balances"]["collectibles"]
		expanded?: boolean
		count?: number
		isColumn?: boolean
	}
> = ({ id, collectibles, expanded, count = 5, isColumn = true, className, ...props }) => {
	const { isAnonymous, isExternal, column, collectibles: apiCollectibles } = useSockets(id)
	const { data: columnCollectibles } = api.socket.balances.collectibles.useQuery(column?.viewAs?.socketAddress, {
		enabled: isExternal
	})

	collectibles = collectibles ?? columnCollectibles ?? apiCollectibles

	const [search, handleSearch] = useState("")

	const visibleCollectibles: RouterOutputs["socket"]["balances"]["collectibles"] | Array<undefined> = useMemo(() => {
		if (collectibles === undefined || (search === "" && collectibles.length === 0)) return Array(5).fill(undefined)

		const filteredCollectibles = collectibles.filter(
			collectible =>
				collectible.name.toLowerCase().includes(search.toLowerCase()) ||
				collectible.description.toLowerCase().includes(search.toLowerCase()) ||
				collectible.collection.toLowerCase().includes(search.toLowerCase()) ||
				collectible.collectibles.some(
					collectionCollectible =>
						(collectionCollectible.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
						(collectionCollectible.description ?? "").toLowerCase().includes(search.toLowerCase())
				)
		)

		if (expanded) return filteredCollectibles

		return filteredCollectibles.slice(0, count)
	}, [collectibles, expanded, count, search])

	return (
		<div className={cn("relative flex h-full flex-col gap-2", className)} {...props}>
			{(isAnonymous === false || isExternal) && isColumn && (
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

			<Animate.List>
				{visibleCollectibles.map((collection, index) => (
					<Animate.ListItem key={index}>
						<SocketCollectionItem id={id} collection={collection} searched={search !== ""} />
					</Animate.ListItem>
				))}
			</Animate.List>

			<Callout.Anonymous id={id} viewing="collectibles" isAbsolute={true} />
			<Callout.EmptyAssets
				isEmpty={!isAnonymous && search === "" && collectibles.length === 0}
				isViewing="collectibles"
				isReceivable={false}
			/>

			{visibleCollectibles.map(
				(collection, index) =>
					collection &&
					collection.collectibles.map(collectible => (
						<CollectibleFrame
							key={`${index}-${collectible.identifier}`}
							id={id}
							collection={collection}
							collectible={collectible}
						/>
					))
			)}
		</div>
	)
}
