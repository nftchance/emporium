import Image from "next/image"
import Link from "next/link"

import { motion } from "framer-motion"
import { Book, Twitter } from "lucide-react"

import { Button, HeroBarChart, HeroShapes, LandingContainer } from "@/components"
import { routes } from "@/lib"

const EARLY_ACCESS = process.env.NEXT_PUBLIC_EARLY_ACCESS !== "false"

export const Hero = () => {
	return (
		<div className="relative z-[2] flex h-full min-h-screen w-screen">
			<HeroShapes />
			<HeroBarChart />

			<div className="z-2 relative w-full">
				<LandingContainer className="flex h-full flex-col py-8 text-white">
					<div className="flex flex-row items-center gap-4">
						<Link className="mr-4" href={routes.index}>
							<Image src="/white-icon.svg" alt="Logo" width={24} height={24} />
						</Link>
						<a href={routes.documentation} target="_blank" rel="noreferrer">
							<Book size={18} className="opacity-80 transition-opacity duration-200 hover:opacity-100" />
						</a>
						<a href={routes.twitter} target="_blank" rel="noreferrer">
							<Twitter
								size={18}
								className="opacity-80 transition-opacity duration-200 hover:opacity-100"
							/>
						</a>

						<Button
							variant="none"
							className="ml-auto w-max rounded-md border-[1px] border-white/20 bg-white/20 px-4 py-2 text-center text-sm font-black text-white"
							href={EARLY_ACCESS ? routes.earlyAccess : routes.app}
						>
							Enter App
						</Button>
					</div>

					<div className="my-auto flex min-h-[calc(100vh-180px)] items-center pb-6">
						<div className="my-auto flex flex-col gap-8">
							<motion.h1
								className="max-w-[75%] text-[3.5rem] font-black leading-tight text-white md:text-[72px] lg:text-[96px]"
								initial={{ transform: "translateY(-20px)", opacity: 0 }}
								whileInView={{
									transform: ["translateY(-20px)", "translateY(0px)"],
									opacity: [0, 1]
								}}
								transition={{ duration: 0.3 }}
							>
								Supernatural returns with unparalleled control.
							</motion.h1>

							<motion.p
								className="max-w-[52%] text-[1.25rem] font-bold text-white/80 md:text-[24px]"
								initial={{ transform: "translateY(20px)", opacity: 0 }}
								whileInView={{
									transform: ["translateY(20px)", "translateY(0px)"],
									opacity: [0, 1]
								}}
								transition={{
									duration: 0.3,
									delay: 0.15
								}}
							>
								Use the blockchain like never before with an &ldquo;if this, then that&rdquo; platform
								that enables you to set rules so that everything executes instantly whether you&apos;re
								at the computer or not.
							</motion.p>

							<Button
								variant="none"
								className="mt-8 w-max rounded-md border-[1px] border-white/30 bg-white/20 px-8 py-3 text-center font-black text-white"
								href={EARLY_ACCESS ? routes.earlyAccess : routes.app}
							>
								Enter App
							</Button>
						</div>
					</div>
				</LandingContainer>
			</div>
		</div>
	)
}
