import { FC, HTMLAttributes, useState } from "react"

import { useMotionValueEvent, useScroll } from "framer-motion"
import { Earth, Gem, SearchIcon } from "lucide-react"

import { Workflow } from "@prisma/client"

import { Container, Header, PlugGrid, Search, Tags } from "@/components"
import { useSearch, VIEW_KEYS } from "@/lib"
import { api } from "@/server/client"

export const PlugsDiscover: FC<
	HTMLAttributes<HTMLDivElement> & { id: string; column?: boolean }
> = ({ id, column = false, ...props }) => {
	const { scrollYProgress } = useScroll()
	const {
		search,
		debouncedSearch,
		tag,
		handleSearch,
		handleTag,
		handleReset
	} = useSearch()

	const [communityPlugs, setCommunityPlugs] = useState<{
		count?: number
		plugs: Array<Workflow>
	}>({ plugs: [] })

	const { data: curatedPlugs } = api.plug.all.useQuery({
		target: "curated",
		limit: 4
	})
	const { fetchNextPage, isLoading } = api.plug.infinite.useInfiniteQuery(
		{
			search: debouncedSearch,
			tag,
			limit: 20
		},
		{
			getNextPageParam(lastPage) {
				return lastPage.nextCursor
			},
			onSuccess(data) {
				setCommunityPlugs(() => ({
					count: data.pages[data.pages.length - 1].count,
					plugs: data.pages.flatMap(page => page.plugs)
				}))
			}
		}
	)

	useMotionValueEvent(scrollYProgress, "change", latest => {
		if (!communityPlugs || isLoading || latest < 0.8) return

		if ((communityPlugs.count ?? 0) > communityPlugs.plugs.length) {
			fetchNextPage()
		}
	})

	return (
		<div {...props}>
			<Container column={column}>
				<Search
					icon={<SearchIcon size={14} className="opacity-60" />}
					placeholder="Search Plugs"
					search={search}
					handleSearch={handleSearch}
					clear={true}
				/>
			</Container>

			<Tags tag={tag} handleTag={handleTag} />

			<Container column={column}>
				{!search && !tag && curatedPlugs && curatedPlugs.length > 0 && (
					<>
						<Header
							size="sm"
							icon={<Gem size={14} className="opacity-40" />}
							label="Curated"
						/>
						<PlugGrid
							id={id}
							from={VIEW_KEYS.DISCOVER}
							count={4}
							plugs={curatedPlugs}
						/>
					</>
				)}

				<Header
					size="sm"
					icon={<Earth size={14} className="opacity-40" />}
					label="Community"
				/>
				<PlugGrid
					id={id}
					className="mb-4"
					from={VIEW_KEYS.DISCOVER}
					search={search || tag}
					handleReset={handleReset}
					plugs={communityPlugs.plugs}
				/>
			</Container>
		</div>
	)
}
