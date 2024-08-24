import { createContext, FC, PropsWithChildren, useContext } from "react"

import { api, RouterOutputs } from "@/server/client"

import { useSockets } from "./SocketProvider"

const DURATION = 5 * 60 * 1000

export const BalancesContext = createContext<{
	collectibles: RouterOutputs["socket"]["balances"]["collectibles"]
	positions: RouterOutputs["socket"]["balances"]["positions"]
}>({
	collectibles: [],
	positions: {
		tokens: [],
		defi: {}
	}
})

export const BalancesProvider: FC<PropsWithChildren> = ({ children }) => {
	const { address, socket } = useSockets()

	const { data: collectibles } = api.socket.balances.collectibles.useQuery(
		socket?.socketAddress,
		{
			enabled: socket?.socketAddress !== undefined
		}
	)

	const { data: positions } = api.socket.balances.positions.useQuery(
		address,
		{
			enabled: address !== undefined
		}
	)

	return (
		<BalancesContext.Provider
			value={{
				collectibles: collectibles ?? [],
				positions: positions ?? {
					tokens: [],
					defi: {}
				}
			}}
		>
			{children}
		</BalancesContext.Provider>
	)
}

export const useBalances = () => useContext(BalancesContext)
