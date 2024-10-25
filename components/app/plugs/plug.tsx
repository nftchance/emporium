import { useSession } from "next-auth/react"
import { FC, HTMLAttributes, useEffect } from "react"

import { SearchIcon } from "lucide-react"

import { ActionsFrame, ActionView, Button, ExecuteFrame, ManagePlugFrame, Search, ShareFrame } from "@/components"
import { usePlugs } from "@/contexts"
import { cn } from "@/lib"
import { MOBILE_INDEX, useColumns } from "@/state"

export const Plug: FC<HTMLAttributes<HTMLDivElement> & { index?: number; item?: string; from?: string }> = ({
	index = -1,
	item,
	from,
	...props
}) => {
	const { data: session } = useSession()
	const { frame } = useColumns(index)
	const { plug } = usePlugs(item)

	const own = plug !== undefined && session && session.address === plug.socketId

	useEffect(() => {
		// Clear schedule data when mounting Plug component
		if (item) {
			const executeFrame = document.getElementById(`execute-frame-${index}`)
			if (executeFrame) {
				const clearSchedule = (executeFrame as any).clearSchedule
				if (typeof clearSchedule === 'function') {
					clearSchedule()
				}
			}
		}
	}, [item, index])

	if (!plug) return null

	return (
		<div {...props}>
			<ActionView index={index} />

			<div className="absolute bottom-0 left-0 z-[2] mb-4 flex w-full flex-col gap-2 overflow-y-visible">
				<div className="pointer-events-none absolute bottom-[120px] left-0 right-0 top-0 z-[-1] bg-gradient-to-t from-white to-white/0" />
				<div
					className={cn(
						"absolute -bottom-4 left-0 right-0 z-[-1] h-[140px] bg-white",
						index !== MOBILE_INDEX && "rounded-b-lg"
					)}
				/>

				{own && (
					<Search
						className="px-4 pt-16"
						icon={<SearchIcon size={14} className="opacity-60" />}
						placeholder="Search protocols and actions"
						handleOnClick={() => frame(`${index}-${item}-actions`)}
					/>
				)}

				<div className="relative flex flex-row gap-2 px-4">
					<Button variant="secondary" className="w-max bg-white" onClick={() => frame("run")}>
						Run
					</Button>

					<Button className="w-full" onClick={() => frame("schedule")}>
						Schedule
					</Button>
				</div>
			</div>

			{item && (
				<>
					<ExecuteFrame index={index} item={item} />
					<ManagePlugFrame index={index} item={item} from={from} />
					<ActionsFrame index={index} item={item} />
					<ShareFrame index={index} item={item} />
				</>
			)}
		</div>
	)
}
