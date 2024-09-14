import { FC } from "react"

import { RouterOutputs } from "@/server/client"

import { useFrame } from "@/contexts"

export const SocketCollectibleItem: FC<{
	id: string
	collection: NonNullable<RouterOutputs["socket"]["balances"]["collectibles"]>[number]
	collectible?: NonNullable<RouterOutputs["socket"]["balances"]["collectibles"]>[number]["collectibles"][number]
}> = ({ id, collection, collectible }) => {
	const { handleFrame } = useFrame({
		id,
		key: `${collection.slug}-${collectible?.contract}-${collectible?.identifier}`
	})

	return (
		<>
			<div
				className="z-[4] w-full rounded-md"
				style={{
					paddingTop: "100%",
					backgroundImage: `url(${collectible?.displayImageUrl || collection.imageUrl})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat"
				}}
				onClick={() => handleFrame()}
			/>
		</>
	)
}
