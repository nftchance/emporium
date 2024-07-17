import { FC } from "react"

import { usePathname } from "next/navigation"
import { useRouter } from "next/router"

import { motion } from "framer-motion"

import { Workflow } from "@prisma/client"

import { PlugGridItem } from "@/components/app/plugs/grid-item"
import { Button } from "@/components/buttons"
import { usePlugs } from "@/contexts/PlugProvider"
import { routes } from "@/lib/constants"

type Props = {
	from: string
	search?: string
	handleReset?: () => void
	count?: number
	plugs: Array<Workflow> | undefined
} & React.HTMLAttributes<HTMLDivElement>

export const PlugGrid: FC<Props> = ({
	from,
	search,
	handleReset,
	count,
	plugs,
	...props
}) => {
	const router = useRouter()
	const pathname = usePathname()

	const { handle } = usePlugs()

	if (plugs === undefined) return null

	return (
		<div {...props}>
			{plugs && plugs.length > 0 ? (
				<motion.div
					className="grid grid-cols-2 gap-1 lg:grid-cols-4"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: { opacity: 0 },
						visible: {
							opacity: 1,
							transition: {
								staggerChildren: 0.05
							}
						}
					}}
				>
					{plugs
						.slice(0, count || plugs.length)
						.map((plug, index) => (
							<motion.div
								key={`${plug.id}-${index}`}
								variants={{
									hidden: { opacity: 0, y: 10 },
									visible: {
										opacity: 1,
										y: 0,
										transition: {
											type: "spring",
											stiffness: 100,
											damping: 10
										}
									}
								}}
							>
								<PlugGridItem from={from} plug={plug} />
							</motion.div>
						))}
				</motion.div>
			) : [routes.app.index, routes.app.plugs.mine].includes(
					router.pathname
			  ) ? (
				<div className="my-64 flex flex-col gap-[30px]">
					<p className="mx-auto max-w-[380px] text-center text-lg opacity-60">
						Browse the existing templates or create your first Plug
						from scratch by clicking the button below and assembling
						your strategy.
					</p>
					<div className="mx-auto flex flex-row gap-1">
						<Button
							variant="secondary"
							href={routes.app.plugs.templates}
							className="w-max"
						>
							See Templates
						</Button>
						<Button
							className="w-max"
							onClick={() => handle.plug.add(pathname)}
						>
							Create
						</Button>
					</div>
				</div>
			) : search !== "" && plugs.length === 0 ? (
				<div className="mx-auto my-44 flex h-full max-w-[80%] flex-col gap-2 text-center">
					<p className="text-lg font-bold">No results found.</p>
					<p className="opacity-60">
						We looked through all of the results but could not find
						any matches. Reset your filter or try a different
						search.
					</p>

					{handleReset && (
						<div className="mx-auto mt-4 flex flex-row gap-1">
							<Button
								className="w-max"
								onClick={() => handleReset()}
							>
								Reset Filters
							</Button>
						</div>
					)}
				</div>
			) : (
				<></>
			)}
		</div>
	)
}
