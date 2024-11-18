import { FC, HTMLAttributes, useMemo } from "react"

import { SearchIcon } from "lucide-react"

import { Callout, Container, PlugGrid, Search, Tags } from "@/components"
import { cn, useSearch } from "@/lib"
import { api } from "@/server/client"
import { COLUMNS } from "@/state"

export const PlugsDiscover: FC<HTMLAttributes<HTMLDivElement> & { index?: number }> = ({
	index = -1,
	className,
	...props
}) => {
	const { search, tag, handleSearch, handleTag } = useSearch()
	const { data: plugs } = api.plugs.all.useQuery({
		target: "others"
	})

	const visiblePlugs = useMemo(() => {
		if (plugs === undefined || plugs.length === 0) {
			return Array(12).fill(undefined)
		}

		// Filter plugs based on search text
		return plugs.filter(plug => {
			if (!search) return true
			return plug.name.toLowerCase().includes(search.toLowerCase())
		})
	}, [plugs, search])

	return (
		<div className={cn("flex h-full flex-col gap-2", className)} {...props}>
			{plugs && plugs.length > 0 && (
				<Container>
					<Search
						icon={<SearchIcon size={14} className="opacity-60" />}
						placeholder="Search Plugs"
						search={search}
						handleSearch={handleSearch}
						clear={true}
					/>
				</Container>
			)}

			{visiblePlugs.some(plug => Boolean(plug)) && <Tags tag={tag} handleTag={handleTag} />}

			<Callout.EmptySearch
				isEmpty={(search !== "" && plugs && plugs.length === 0) || false}
				search={search}
				handleSearch={handleSearch}
			/>

			<Container>
				<PlugGrid index={index} className="mb-4" from={COLUMNS.KEYS.DISCOVER} plugs={visiblePlugs} />
			</Container>

			<Callout.EmptyPlugs index={index} isEmpty={(search === "" && plugs && plugs.length === 0) || false} />
		</div>
	)
}
