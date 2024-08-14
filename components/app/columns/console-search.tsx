import { FC, HTMLAttributes, useState } from "react"

import {
	ChevronDown,
	ImageIcon,
	LoaderCircle,
	Plug,
	SearchIcon
} from "lucide-react"

import { Button } from "@/components/shared"
import { cn, useDebounce, VIEW_KEYS } from "@/lib"
import { api } from "@/server/client"

import { Search } from "../inputs"
import { PlugGrid } from "../plugs"
import { SocketCollectionList, SocketTokenList } from "../sockets"

export const ConsoleSearch: FC<
	HTMLAttributes<HTMLDivElement> & { id: string }
> = ({ id, className, ...props }) => {
	const [search, debounced, handleSearch] = useDebounce("", 500)
	const [expanded, setExpanded] = useState<Array<string>>([])

	const enabled = debounced !== ""

	const { data: results, isInitialLoading } = api.misc.search.useQuery(
		debounced,
		{
			enabled
		}
	)

	const emptyResults =
		results &&
		results.plugs.length === 0 &&
		results.tokens.length === 0 &&
		results.collectibles.length === 0

	return (
		<div
			className={cn("flex h-full flex-col overflow-x-hidden", className)}
			{...props}
		>
			<Search
				className="mb-4"
				icon={<SearchIcon size={14} className="opacity-60" />}
				placeholder="Search protocols, actions, or assets"
				search={search}
				handleSearch={handleSearch}
				clear={true}
			/>

			{enabled === false && (
				<div className="my-auto flex flex-col items-center">
					<p className="font-bold">Submit your search.</p>
					<p className="mb-4 max-w-[320px] text-center font-bold opacity-40">
						Here you can search for everything from plugs, tokens,
						collectibles, and more.
					</p>
				</div>
			)}

			{isInitialLoading && (
				<div className="my-auto flex flex-col items-center">
					<p className="font-bold">
						<LoaderCircle
							size={24}
							className="animate-spin opacity-60"
						/>
					</p>
				</div>
			)}

			{emptyResults && (
				<div className="my-auto flex flex-col items-center">
					<p className="font-bold">No results.</p>
					<p className="mb-4 max-w-[320px] text-center font-bold opacity-40">
						Your search returned no results.
					</p>
					<Button onClick={() => handleSearch("")}>Reset</Button>
				</div>
			)}

			{results && (
				<div className="flex flex-col gap-4">
					{results.plugs.length > 0 && (
						<div className="flex flex-col gap-2">
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
													: prev.filter(
															key =>
																key !== "plugs"
														)
											)
										}
									>
										{expanded.includes("plugs")
											? "Collapse"
											: "See All"}
									</Button>
								)}
							</p>

							<PlugGrid
								id={id}
								from={VIEW_KEYS.SEARCH}
								plugs={
									expanded.includes("plugs")
										? results.plugs
										: results.plugs.slice(0, 6)
								}
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
												prev.includes("tokens") ===
												false
													? [...prev, "tokens"]
													: prev.filter(
															key =>
																key !== "tokens"
														)
											)
										}
									>
										{expanded.includes("tokens")
											? "Collapse"
											: "See All"}
									</Button>
								)}
							</p>
							<SocketTokenList
								id={id}
								tokens={
									expanded.includes("tokens")
										? results.tokens
										: results.tokens.slice(0, 10)
								}
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
												prev.includes(
													"collectibles"
												) === false
													? [...prev, "collectibles"]
													: prev.filter(
															key =>
																key !==
																"collectibles"
														)
											)
										}
									>
										{expanded.includes("collectibles")
											? "Collapse"
											: "See All"}
									</Button>
								)}
							</p>

							<SocketCollectionList
								id={id}
								collectibles={
									expanded.includes("collectibles")
										? results.collectibles
										: results.collectibles.slice(0, 10)
								}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
