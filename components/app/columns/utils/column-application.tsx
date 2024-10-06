import Image from "next/image"
import React, { useEffect, useState } from "react"
import { isAndroid, isIOS, isMacOs, isWindows, osName } from "react-device-detect"

import { motion } from "framer-motion"
import { ArrowDownCircleIcon, LoaderCircle, Plus } from "lucide-react"

import { Button } from "@/components/shared"
import { useBeforeInstall } from "@/contexts"
import { cn } from "@/lib"

type Instructions = Record<"macOS" | "iOS" | "android" | "linux" | "windows", InstructionStep[]>

type InstructionStep = {
	index: string
	step: React.ReactNode
}

const instructions = {
	android: [{ index: "1️⃣", step: "Open this page in Chrome" }],
	windows: [{ index: "1️⃣", step: "Open this page in Edge" }],
	linux: [{ index: "1️⃣", step: "Open this page in Chromium or Chrome" }],
	iOS: [
		{ index: "1️⃣", step: "Open this page in Safari" },
		{
			index: "2️⃣",
			step: (
				<>
					Click the Share button
					<img src="/static/misc/ios-share-icon.png" alt="apple-share-icon" className="h-5" />
					in the Safari toolbar, then choose Add to home screen
				</>
			)
		},
		{
			index: "3️⃣",
			step: "Type the name that you want to use for the web app, then click Add."
		}
	],
	macOS: [
		{ index: "1️⃣", step: "Open this page in Safari" },
		{
			index: "2️⃣",
			step: (
				<>
					From the menu bar, choose File &gt; Add to Dock . Or click the Share button
					<img src="/static/misc/macos-share-icon.png" alt="apple-share-icon" className="h-5 w-5" />
					in the Safari toolbar, then choose Add to Dock
				</>
			)
		},
		{
			index: "3️⃣",
			step: <>Type the name that you want to use for the web app, then click Add</>
		}
	]
} satisfies Instructions

function getInstructions() {
	if (isMacOs) {
		return instructions.macOS
	}

	if (isIOS) {
		return instructions.iOS
	}

	if (isAndroid) {
		return instructions.android
	}

	if (osName === "Linux") {
		return instructions.linux
	}

	if (isWindows) {
		return instructions.windows
	}

	return []
}

export const ColumnApplication: React.FC<React.HTMLAttributes<HTMLDivElement> & { index: number }> = ({
	index,
	className,
	...props
}) => {
	const beforeInstall = useBeforeInstall()

	if (!beforeInstall) return null

	const osInstructions = getInstructions()

	if (osInstructions.length === 0) return null

	return (
		<div className={cn("flex h-full items-center justify-center overflow-x-hidden", className)} {...props}>
			<div className="absolute top-0 h-1/4 w-full bg-gradient-to-tr from-plug-green to-plug-yellow blur-[320px] filter" />

			<div className="relative h-full w-full overflow-hidden font-bold">
				<motion.div
					className="absolute left-[-5%] top-[-5%] flex h-[110%] w-[110%] skew-x-[10deg] items-center justify-center mix-blend-overlay"
					initial={{ scale: 1.4 }}
					animate={{ scale: 2.2 }}
					transition={{
						duration: 0.3,
						ease: "easeInOut",
						repeat: Infinity,
						repeatType: "reverse",
						repeatDelay: 3
					}}
				>
					<motion.svg
						className="origin-center -translate-x-1/2 -translate-y-1/2"
						viewBox="0 0 1500 1500"
						initial={{ rotate: 0 }}
						animate={{ rotate: -360 }}
						transition={{ duration: 20, repeat: Infinity, repeatType: "loop", ease: "linear" }}
					>
						<defs>
							<path id="circle" d="M750,750 m-550,0 a550,550 0 0,1 1100,0 a550,550 0 0,1 -1100,0" />
						</defs>
						<text className="text-[232px]">
							<textPath href="#circle" startOffset="0%">
								Stay Plugged In • Save as App •
							</textPath>
						</text>
					</motion.svg>
				</motion.div>

				<div className="absolute inset-0 z-[20] flex flex-col items-center justify-center gap-2 px-4 text-center">
					<h2 className="mb-2 flex h-4 flex-wrap gap-4 text-xl">
						Add
						<motion.span
							className="relative cursor-pointer"
							initial={{ y: -25 }}
							animate={{ y: -5 }}
							transition={{
								y: {
									duration: 0.6,
									repeat: Infinity,
									repeatType: "reverse",
									ease: "easeIn"
								}
							}}
							onClick={
								beforeInstall.isNativePromptAvailable
									? async () => {
											await beforeInstall.prompt()
										}
									: undefined
							}
						>
							<Image
								className="absolute left-0 top-1/2 h-16 w-16 -translate-y-1/2 blur-lg filter"
								src="/plug-logo-green.svg"
								alt="Logo"
								width={64}
								height={64}
							/>
							<Image
								className="relative h-8"
								src="/plug-logo-green.svg"
								alt="Logo"
								width={32}
								height={32}
							/>
						</motion.span>
						to your dock.
					</h2>

					{beforeInstall.isNativePromptAvailable ? (
						<>
							<p className="mb-4 max-w-[300px] text-sm opacity-40">
								Create a shortcut to manage your onchain activity in just one click away at all times.
							</p>
							<Button
								className="truncate"
								sizing="sm"
								onClick={async () => {
									await beforeInstall.prompt()
								}}
							>
								Install
							</Button>
						</>
					) : (
						<div className="max-w-[300px] text-sm opacity-40">
							{getInstructions().map(({ step }, index) => (
								<span key={index} className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
									{step}
								</span>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
