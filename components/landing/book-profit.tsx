import Image from "next/image"

import { motion } from "framer-motion"
import { Sun } from "lucide-react"

import { InfoCard } from "@/components"

// export const BookProfit = () => {
// 	const actions = [
// 		["Dollar Cost Average USDC:ETH", "danner"],
// 		["Auto-Redeem MKR Backing", "federalreserve"],
// 		["Bid on Noun with Pineapple Hat", "nftchance"],
// 		["Buy ETH on Market Dump", "federalreserve"],
// 		["Auto-Renew ENS", "danner"],
// 		["Stream 65 ETH to Team", "nftchance"],
// 		["Enter Gearbox at Target APY", "nftchance"],
// 		["Bid on Noun", "nftchance"],
// 		["Rebalance Memecoin Portfolio", "federalreserve"],
// 		["Fill Ethena Liquidity Cap to Limit", "nftchance"],
// 		["Compound Enjoy Staking Rewards", "nftchance"],
// 		["Top-Up Loan Health Factor", "federalreserve"],
// 		["Exit Yearn at Target APY", "nftchance"]
// 	]
//
// 	return (
// 		<InfoCard
// 			icon={<Sun size={24} className="opacity-40" />}
// 			text="Your transactions run 24 hours."
// 			description="Stay active in a market that never sleeps by keeping your money working even when you aren't."
// 			className="col-span-2 h-[540px] xl:col-span-4 xl:row-span-2 xl:h-full"
// 		>
// 			<motion.div
// 				className="mr-[-120px] flex flex-col items-end justify-end gap-2 overflow-y-hidden sm:mr-6 lg:mr-12"
// 				animate={{
// 					transform: [`translateY(240px)`, `translateY(${240 + -1 * actions.length * 80}px)`]
// 				}}
// 				transition={{
// 					duration: 30,
// 					repeat: Infinity,
// 					repeatType: "reverse",
// 					repeatDelay: 1,
// 					ease: "easeInOut"
// 				}}
// 			>
// 				{actions.map((action, index) => (
// 					<motion.div
// 						key={index}
// 						className="mr-0 flex w-[420px] items-center gap-4 overflow-hidden rounded-lg border-[1px] border-plug-green/10 bg-white px-6 py-4"
// 					>
// 						<h3 className="flex w-full flex-col">
// 							<span className="font-bold md:text-xl">{action[0]}</span>
// 							<span className="flex w-full flex-row items-center gap-2 md:text-lg">
// 								<Image
// 									src={`/users/${action[1]}.png`}
// 									alt="NFT Chance"
// 									width={18}
// 									height={18}
// 									className="h-4 w-4 rounded-full"
// 								/>
// 								<span className="flex w-full justify-between font-bold opacity-40">
// 									<span className="w-full">{action[1]}.eth</span>
// 									<span className="ml-auto whitespace-nowrap">
// 										{Math.floor(index ** 1.2) + 1} hrs. ago
// 									</span>
// 								</span>
// 							</span>
// 						</h3>
// 					</motion.div>
// 				))}
// 			</motion.div>
// 			<div className="absolute bottom-[30%] left-0 right-0 top-[60%] bg-gradient-to-b from-plug-white/0 to-plug-white" />
// 			<div className="absolute bottom-0 left-0 right-0 top-[70%] bg-plug-white" />
// 		</InfoCard>
// 	)
// }

export const BookProfit = () => {
	return (
		<InfoCard
			icon={<Sun size={24} className="opacity-40" />}
			text="Constantly pinging the market."
			description="With Plug monitoring every onchain transaction, you can immediately respond no matter the state of the market."
			className="col-span-2 h-[540px] xl:col-span-4 xl:row-span-2 xl:h-full"
		>
			<div className="absolute inset-0 z-[-1] flex items-center justify-center overflow-hidden">
				{Array.from({ length: 20 }).map((_, index) => (
					<motion.div
						key={index}
						className="absolute origin-center rounded-full border-[2px] border-plug-yellow"
						style={{
							width: 20 + Math.sin(index * 0.5) * 20,
							height: 20 + Math.cos(index * 0.5) * 20
						}}
						animate={{
							width: [0, 20 + index * 200],
							height: [0, 20 + index * 200]
						}}
						transition={{
							duration: 1,
							repeat: Infinity,
							repeatType: "reverse",
							ease: "easeInOut",
							delay: index * 0.1
						}}
					/>
				))}
				{Array.from({ length: 12 }).map((_, index) => (
					<motion.div
						key={index}
						className="absolute origin-center rounded-full border-[2px] border-plug-yellow"
						animate={{
							height: [0, 2000],
							rotate: [index * 15, index * 15 + 90]
						}}
						transition={{
							duration: 1,
							repeat: Infinity,
							repeatType: "reverse",
							ease: "easeInOut"
						}}
					/>
				))}
			</div>
			<div className="absolute bottom-[20%] left-0 right-0 top-[70%] bg-gradient-to-b from-plug-white/0 to-plug-white" />
			<div className="absolute bottom-0 left-0 right-0 top-[80%] bg-plug-white" />
		</InfoCard>
	)
}
