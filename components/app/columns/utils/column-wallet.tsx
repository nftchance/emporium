import { useSession } from "next-auth/react"
import { FC } from "react"

import { useSocket } from "@/state"

import { SocketAssets } from "../../sockets"

export const ColumnWallet: FC<{ index: number }> = () => {
	const { data: session } = useSession()
	const { socket } = useSocket()

	if (!socket || !session?.user.id) return null

	return (
		<div className="flex h-full flex-col gap-4 overflow-y-scroll p-4 text-center">
			<SocketAssets index={-2} address={session?.user.id} />
		</div>
	)
}
