import { FC, HTMLAttributes, useMemo } from "react"

import { ActivityItem } from "@/components/app/sockets/activity/activity-item"
import { Callout } from "@/components/app/utils/callout"
import { useActivities } from "@/contexts"
import { cn } from "@/lib"
import { useSocket } from "@/state/authentication"
import { COLUMNS, useColumnStore } from "@/state/columns"

export const SocketActivity: FC<HTMLAttributes<HTMLDivElement> & { index?: number }> = ({
	index = COLUMNS.MOBILE_INDEX,
	className,
	...props
}) => {
	const { column } = useColumnStore(index, "simulation")
	const { isAnonymous } = useSocket()
	const { activities, isLoading } = useActivities()

	const visibleActivities = useMemo(() => {
		if (activities === undefined || isLoading || activities.length === 0) return Array(10).fill(undefined)
		return activities
	}, [activities, isLoading])

	const simulationId = useMemo(() => {
		const prefix = "-simulation"
		const isSimulation = column?.frame?.endsWith(prefix)

		if (!isSimulation || !column?.frame) return

		return column?.frame.split(prefix)[0]
	}, [column?.frame])

	return (
		<div className={cn("flex flex-col gap-2", className)} {...props}>
			<Callout.Anonymous index={index} viewing="activity" isAbsolute={true} />
			<Callout.EmptyActivity index={index} isEmpty={!isAnonymous && activities?.length === 0} />

			<div className="flex flex-col gap-2">
				{visibleActivities.map((activity, activityIndex) => (
					<ActivityItem
						key={activity?.id || activityIndex}
						index={index}
						activity={activity}
						simulationId={simulationId}
					/>
				))}
			</div>
		</div>
	)
}
