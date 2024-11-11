import { FC, PropsWithChildren } from "react"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, X } from "lucide-react"

import { Button, Header } from "@/components"
import { cn, useMediaQuery } from "@/lib"
import { useColumnStore } from "@/state"

type Props = React.HTMLAttributes<HTMLDivElement> &
	PropsWithChildren & {
		index: number
		label: string | JSX.Element
		visible: boolean
		icon?: JSX.Element
		handleBack?: () => void
		hasOverlay?: boolean
		hasChildrenPadding?: boolean
		next?: JSX.Element
		scrollBehavior?: "content" | "partial"
	}

export const Frame: FC<Props> = ({
	index,
	label,
	visible,
	icon,
	handleBack,
	hasOverlay = false,
	hasChildrenPadding = true,
	children,
	className,
	next,
	scrollBehavior = "content"
}) => {
	const { md } = useMediaQuery()
	const { handle } = useColumnStore(index)

	return (
		<AnimatePresence>
			{visible ? (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 0.2,
							ease: "easeInOut",
							delay: 0.1
						}}
						className={cn(
							md ? "absolute" : "fixed",
							"bottom-0 left-0 right-0 top-0 z-[10] cursor-pointer",
							(handleBack === undefined || hasOverlay === true) &&
								"bg-gradient-to-b from-black/10 to-black/30"
						)}
						onClick={() => handle.frame()}
					/>

					<motion.div
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
						className={cn(
							md ? "absolute" : "fixed",
							"inset-0 top-auto max-h-[80vh] w-full rounded-t-lg bg-white",
							scrollBehavior === "content" && "overflow-y-auto overflow-x-hidden",
							className,
							"z-[41]"
						)}
					>
						<div className="sticky top-0 z-[31] mb-4 flex flex-row items-center gap-2 overflow-hidden rounded-t-lg border-b-[1px] border-grayscale-100 bg-white px-6 py-4">
							{handleBack && (
								<Button variant="secondary" onClick={handleBack} className="mr-2 h-min rounded-sm p-1">
									<ChevronLeft size={14} />
								</Button>
							)}
							<Header
								variant="frame"
								size="md"
								className="h-10"
								icon={icon}
								label={label}
								nextPadded={false}
								nextOnClick={() => handle.frame()}
								nextLabel={next ?? <X size={14} className="opacity-60 hover:opacity-100" />}
								nextEmpty={next !== undefined}
							/>
						</div>
						<div
							className={cn(
								hasChildrenPadding && "px-6 pb-4",
								scrollBehavior === "partial" && "flex max-h-[calc(80vh-5rem)] flex-col overflow-hidden"
							)}
						>
							{children}
						</div>
					</motion.div>
				</>
			) : null}
		</AnimatePresence>
	)
}
