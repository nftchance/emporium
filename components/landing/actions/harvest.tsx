import { useRef } from "react"

import { motion, useScroll, useTransform } from "framer-motion"
import { CalendarClock } from "lucide-react"

import { InfoCard } from "../cards"

export const ActionTrade = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"]
	})
	const pathLength = useTransform(scrollYProgress, [0.2, 1], [0, 1])

	return (
		<div ref={containerRef}>
			<InfoCard
				icon={<CalendarClock size={24} className="opacity-40" />}
				text="Trade."
				description="Move your crypto quickly between chains."
				className="relative z-[99999] h-[320px] sm:h-[320px] 2xl:h-[300px]"
			>
				<div className="absolute bottom-1/2 left-0 right-0 top-0 flex flex-row items-center justify-center text-plug-yellow">
					<svg width="100%" height="100%" viewBox="0 0 400 200">
						<motion.path
							style={{ pathLength }}
							d="M0,200 C50,180 70,160 100,110 S150,40 200,100 S250,40 300,60 S350,40 400,0"
							fill="none"
							stroke="currentColor"
							strokeWidth="10"
							strokeLinecap="round"
						/>
					</svg>
				</div>

				<div className="absolute bottom-[50%] left-0 right-0 top-0 bg-gradient-to-b from-plug-white/0 to-plug-white" />
				<div className="absolute bottom-0 left-0 right-0 top-[50%] bg-plug-white" />
			</InfoCard>
		</div>
	)
}
