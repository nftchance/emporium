import { useSession } from "next-auth/react"
import { FC, ReactNode } from "react"

import { AnimatePresence, motion } from "framer-motion"
import { BookUser, ClipboardCheck, Eye, Grip, LogOut, PanelRightOpen, Plus, Search, SearchIcon, X } from "lucide-react"

import { Avatar, Button, ColumnSearch, ColumnViewAs, Header, Image } from "@/components"
import { usePlugs } from "@/contexts"
import { cn, useClipboard, useConnect, VIEW_KEYS } from "@/lib"
import { useDisconnect } from "@/lib/hooks/wallet/useDisconnect"
import { useColumns, useSocket } from "@/state"
import { useSidebar } from "@/state/sidebar"

const ConsoleSidebarAction: FC<
	React.HTMLAttributes<HTMLDivElement> & {
		icon: ReactNode
		isExpanded: boolean
		isPrimary?: boolean
		isActive?: boolean
	}
> = ({ icon, isExpanded, isPrimary = false, isActive = false, className, title, ...props }) => {
	return (
		<div
			className={cn(
				"group mr-auto flex h-8 w-full cursor-pointer select-none flex-row items-center justify-center gap-4 p-4 transition-all duration-200 ease-in-out",
				className
			)}
			{...props}
		>
			<div
				className={cn(
					"group flex h-8 cursor-pointer flex-row items-center justify-center gap-4 rounded-sm border-[1px] border-grayscale-100 bg-white p-4 px-2 transition-all duration-200 ease-in-out group-hover:bg-grayscale-0",
					isActive && "bg-grayscale-0 hover:bg-white",
					isPrimary &&
						"group-hover: bg-gradient-to-tr from-plug-green to-plug-yellow text-white shadow-[0_0_16px_rgba(0,255,0,1)] group-hover:shadow-[0_0_8px_rgba(0,255,0,1)]"
				)}
			>
				{icon}
			</div>
			<p
				className={cn(
					"mr-auto whitespace-nowrap font-bold opacity-40 transition-all duration-200 ease-in-out",
					isExpanded === false ? "hidden" : "group-hover:opacity-80"
				)}
			>
				{isExpanded ? title : "."}
			</p>
		</div>
	)
}

export const ConsoleSidebar = () => {
	const { account } = useConnect()
	const { disconnect } = useDisconnect(true)
	const { data: session } = useSession()

	const { avatar, socket } = useSocket()
	const { handle: handlePlugs } = usePlugs("NOT_IMPLEMENTED")
	const { is, toggleExpanded, toggleSearching, toggleViewingAs } = useSidebar()
	const { copied, handleCopied } = useClipboard(socket?.socketAddress ?? "")

	return (
		<div className="flex h-full w-max select-none flex-row bg-transparent">
			<div className="flex h-full w-max flex-col items-center border-r-[1px] border-grayscale-100 py-4">
				<div className={cn("flex w-full flex-col gap-4 p-4")}>
					{session && (
						<button
							className="relative mx-4 mb-4 h-10 w-10 rounded-sm bg-grayscale-0 transition-all duration-200 ease-in-out"
							onClick={() => handleCopied()}
						>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								{avatar ? (
									<Image
										src={avatar}
										alt="ENS Avatar"
										width={64}
										height={64}
										className="h-full w-full rounded-sm"
									/>
								) : (
									<Avatar name={socket?.id ?? ""} />
								)}
							</motion.div>

							<AnimatePresence>
								{copied && (
									<motion.div
										className="absolute -bottom-2 -right-2 rounded-full border-[1px] border-grayscale-0 bg-white p-1"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<ClipboardCheck size={14} className="opacity-40" />
									</motion.div>
								)}
							</AnimatePresence>
						</button>
					)}

					<ConsoleSidebarAction
						icon={
							<Plus
								size={14}
								className="transition-all duration-200 ease-in-out group-hover:opacity-100"
							/>
						}
						title="New Plug"
						isExpanded={is.expanded}
						isPrimary={true}
						onClick={() => handlePlugs.plug.add({ index: 0 })}
					/>

					<ConsoleSidebarAction
						icon={
							<Search
								size={14}
								className="opacity-60 transition-all duration-200 ease-in-out group-hover:opacity-100"
							/>
						}
						title="Search"
						isExpanded={is.expanded}
						isActive={is.searching}
						onClick={toggleSearching}
					/>

					<ConsoleSidebarAction
						icon={
							<Eye
								size={14}
								className="opacity-60 transition-all duration-200 ease-in-out group-hover:opacity-100"
							/>
						}
						title="View As"
						isExpanded={is.expanded}
						isActive={is.viewingAs}
						onClick={toggleViewingAs}
					/>
				</div>

				<div className="mt-auto flex w-full flex-col items-center gap-4 p-4">
					<ConsoleSidebarAction
						icon={
							<PanelRightOpen
								size={14}
								className="rotate-180 opacity-60 transition-all duration-200 ease-in-out group-hover:opacity-100"
							/>
						}
						title="Collapse"
						isExpanded={is.expanded}
						onClick={toggleExpanded}
					/>

					{account.address && (
						<ConsoleSidebarAction
							icon={
								<LogOut
									size={14}
									className="rotate-180 opacity-60 transition-all duration-200 ease-in-out group-hover:opacity-100"
								/>
							}
							title="Logout"
							isExpanded={is.expanded}
							onClick={toggleExpanded}
						/>
					)}
				</div>
			</div>

			{(is.viewingAs || is.searching) && (
				<div className="flex border-r-[1px] border-grayscale-100">
					<div className="m-2 flex min-w-[420px] flex-col overflow-hidden rounded-lg border-[1px] border-grayscale-100">
						<div className="relative z-[30] w-full rounded-t-lg border-b-[1px] border-grayscale-100 px-4">
							<Header
								label={is.viewingAs ? "View As" : "Search"}
								size="md"
								icon={
									is.searching ? (
										<SearchIcon
											size={14}
											className="m-1 opacity-40 transition-all duration-200 ease-in-out group-hover:opacity-60"
										/>
									) : (
										<Eye
											size={14}
											className="m-1 opacity-40 transition-all duration-200 ease-in-out group-hover:opacity-60"
										/>
									)
								}
								nextPadded={false}
								nextOnClick={is.viewingAs ? toggleViewingAs : toggleSearching}
								nextLabel={<X size={14} />}
							/>
						</div>

						<div className="h-full">
							{is.searching && <ColumnSearch index={0} className="px-4" />}
							{is.viewingAs && <ColumnViewAs />}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
