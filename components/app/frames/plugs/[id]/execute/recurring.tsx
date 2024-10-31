import { FC } from "react"

import { Clock } from "lucide-react"

import { Button, Frame } from "@/components"
import { frequencies } from "@/lib"
import { useColumns } from "@/state"

export const RecurringFrame: FC<{ index: number }> = ({ index }) => {
	const { column, isFrame, frame, schedule } = useColumns(index, "recurring")

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
						className="py-4"
						onClick={() => {
							schedule({ date: column?.schedule?.date, repeats: frequency })
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
