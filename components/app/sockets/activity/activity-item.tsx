import { FC } from "react"

import { AlertCircle, CheckCircle, Clock, Loader, XCircle } from "lucide-react"

import { RouterOutputs } from "@/server/client"

import { Accordion, Counter, DateSince, ExecutionFrame } from "@/components"
import { useColumns } from "@/state"

const ActivityIcon: FC<{ status: string }> = ({ status }) => {
	switch (status) {
		case "pending":
			return (
				<div className="relative h-10 min-w-10">
					<div className="absolute mt-8 h-48 w-10 rounded-full bg-blue-400 blur-2xl filter" />
					<Loader
						className="absolute top-1/2 ml-auto h-4 w-6 -translate-y-1/2 text-center text-blue-400"
						size={16}
					/>
				</div>
			)
		case "success":
			return (
				<div className="relative h-10 min-w-10">
					<div className="absolute mt-8 h-48 w-10 rounded-full bg-plug-green blur-2xl filter" />
					<CheckCircle
						className="absolute top-1/2 ml-auto h-4 w-6 -translate-y-1/2 text-center text-plug-green"
						size={16}
					/>
				</div>
			)
		case "error":
			return (
				<div className="relative h-10 min-w-10">
					<div className="absolute mt-8 h-48 w-10 rounded-full bg-plug-red blur-2xl filter" />
					<XCircle
						className="absolute top-1/2 h-4 w-6 -translate-y-1/2 text-center text-plug-red"
						size={16}
					/>
				</div>
			)
		default:
			return (
				<div className="relative h-10 min-w-10">
					<div className="absolute mt-8 h-48 w-10 rounded-full bg-yellow-400 blur-2xl filter" />
					<AlertCircle
						className="absolute top-1/2 h-4 w-6 -translate-y-1/2 text-center text-yellow-400"
						size={16}
					/>
				</div>
			)
	}
}
export const ActivityItem: FC<{
	index: number
	activity: RouterOutputs["plug"]["action"]["activity"][number] | undefined
}> = ({ index, activity }) => {
	const { frame } = useColumns(index, `${activity?.id}-activity`)

	return (
		<>
			<Accordion loading={activity === undefined} onExpand={() => frame()}>
				{activity === undefined ? (
					<div className="invisible">
						<p>.</p>
						<p>.</p>
					</div>
				) : (
					<div className="flex w-full flex-row">
						<ActivityIcon status="pending" />

						<div className="relative flex w-full flex-col overflow-hidden">
							<div className="flex flex-row items-center justify-between gap-2 font-bold">
								<p className="mr-2 truncate overflow-ellipsis whitespace-nowrap">
									{activity.workflow.name}
								</p>
								<div className="flex-shrink-0">
									<DateSince date={new Date(activity.createdAt)} />
								</div>
							</div>
							<div className="flex w-full flex-row items-center justify-between text-sm font-bold text-black text-opacity-40">
								<p>Pending</p>
								{/*<p>{formatTitle(activity.status)}</p>*/}
								<p className="flex flex-row gap-2">
									<Counter count={activity.startAt.toLocaleDateString()} />
									<span className="opacity-60">→</span>
									{activity.endAt ? <Counter count={activity.endAt.toLocaleDateString()} /> : "∞"}
								</p>
							</div>
						</div>
					</div>
				)}
			</Accordion>

			{activity && <ExecutionFrame index={index} icon={<ActivityIcon status="pending" />} activity={activity} />}
		</>
	)
}
