import { FC } from "react"

import { Clock } from "lucide-react"

import { Button, Frame } from "@/components"
import { useColumns } from "@/state"

export const frequencies = [
	{ label: "Never", value: "0" },
	{ label: "Daily", value: "1" },
	{ label: "Weekly", value: "7" },
	{ label: "Monthly", value: "30" },
	{ label: "Quarterly", value: "90" },
	{ label: "Yearly", value: "365" }
]

export const RecurringFrame: FC<{ index: number; handleRepeats: (repeats: (typeof frequencies)[0]) => void }> = ({
	index,
	handleRepeats
}) => {
	const { isFrame, frame } = useColumns(index, "recurring")

	return (
		<Frame
			index={index}
			className="scrollbar-hide z-[2] max-h-[calc(100vh-80px)] overflow-y-auto"
			icon={<Clock size={18} className="opacity-60" />}
			label="Recurring Frequency"
			visible={isFrame}
			handleBack={() => frame("schedule")}
			hasOverlay={true}
		>
			<div className="flex flex-col gap-4">
				{frequencies.map(frequency => (
					<Button
						key={frequency.label}
						variant="secondary"
						onClick={() => {
							handleRepeats(frequency)
							frame("schedule")
						}}
					>
						{frequency.label}
					</Button>
				))}
			</div>
		</Frame>
	)
}
