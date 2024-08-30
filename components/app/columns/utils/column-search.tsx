import { FC, HTMLAttributes, useState } from "react"

import { ImageIcon, LoaderCircle, Plug, SearchIcon } from "lucide-react"

import { Button, PlugGrid, Search, SocketCollectionList, SocketTokenList } from "@/components"
import { cn, greenGradientStyle, VIEW_KEYS } from "@/lib"
import { api } from "@/server/client"

export const ColumnSearch: FC<HTMLAttributes<HTMLDivElement> & { id: string }> = ({ id, className, ...props }) => {
	const [search, setSearch] = useState("")
	const [expanded, setExpanded] = useState<Array<string>>([])

	const enabled = search !== ""

	const { data: results, isInitialLoading } = api.misc.search.useQuery(search, {
		enabled
	})

	const emptyResults =
		search !== "" &&
		results &&
		results.plugs.length === 0 &&
		results.tokens.length === 0 &&
		results.collectibles.length === 0

	return (
		<div className={cn("flex h-full flex-col overflow-x-hidden", className)} {...props}>
			<Search
				className="mb-4"
				icon={<SearchIcon size={14} className="opacity-60" />}
				placeholder="Search protocols, actions, or assets"
				search={search}
				handleSearch={setSearch}
				clear={true}
			/>

			{search === "" && (
				<div className="my-auto flex flex-col items-center">
					<p className="font-bold">Submit your search.</p>
					<p className="mb-4 max-w-[320px] text-center opacity-60">
						Here you can search for everything from plugs, tokens, collectibles, and more.
					</p>
				</div>
			)}

			{isInitialLoading && (
				<div className="my-auto flex flex-col items-center">
					<p className="font-bold">
						<LoaderCircle size={24} className="animate-spin opacity-60" />
					</p>
				</div>
			)}

			{emptyResults && (
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
					<Button sizing="sm" onClick={() => setSearch("")}>
						Reset
					</Button>
				</div>
			)}

			{results && (
				<div className="flex flex-col">
					{results.plugs.length > 0 && (
						<div className="mb-4 flex flex-col gap-2">
							<p className="flex flex-row items-center gap-2 font-bold">
								<Plug size={14} className="opacity-40" />
								<span>Plugs</span>
								{results.plugs.length > 6 && (
									<Button
										variant="secondary"
										sizing="sm"
										className="ml-auto rounded-sm p-1 px-2"
										onClick={() =>
											setExpanded(prev =>
												prev.includes("plugs") === false
													? [...prev, "plugs"]
													: prev.filter(key => key !== "plugs")
											)
										}
									>
										{expanded.includes("plugs") ? "Collapse" : "See All"}
									</Button>
								)}
							</p>

							<PlugGrid
								id={id}
								from={VIEW_KEYS.SEARCH}
								plugs={expanded.includes("plugs") ? results.plugs : results.plugs.slice(0, 6)}
							/>
						</div>
					)}

					{results.tokens.length > 0 && (
						<div className="flex flex-col gap-2">
							<p className="flex flex-row items-center gap-2 font-bold">
								<ImageIcon size={14} className="opacity-40" />
								<span>Tokens</span>
								{results.tokens.length > 10 && (
									<Button
										variant="secondary"
										sizing="sm"
										className="ml-auto rounded-sm p-1 px-2"
										onClick={() =>
											setExpanded(prev =>
												prev.includes("tokens") === false
													? [...prev, "tokens"]
													: prev.filter(key => key !== "tokens")
											)
										}
									>
										{expanded.includes("tokens") ? "Collapse" : "See All"}
									</Button>
								)}
							</p>
							<SocketTokenList
								id={id}
								className="mb-4"
								tokens={results.tokens}
								expanded={expanded.includes("tokens")}
								count={5}
								isColumn={false}
							/>
						</div>
					)}

					{results.collectibles.length > 0 && (
						<div className="flex flex-col gap-2">
							<p className="flex flex-row items-center gap-2 font-bold">
								<ImageIcon size={14} className="opacity-40" />
								<span>Collectibles</span>
								{results.collectibles.length > 10 && (
									<Button
										variant="secondary"
										sizing="sm"
										className="ml-auto rounded-sm p-1 px-2"
										onClick={() =>
											setExpanded(prev =>
												prev.includes("collectibles") === false
													? [...prev, "collectibles"]
													: prev.filter(key => key !== "collectibles")
											)
										}
									>
										{expanded.includes("collectibles") ? "Collapse" : "See All"}
									</Button>
								)}
							</p>

							<SocketCollectionList
								id={id}
								className="mb-4"
								collectibles={results.collectibles}
								expanded={expanded.includes("collectibles")}
								count={5}
								isColumn={false}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
