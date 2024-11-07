import { MinimalUserSocketModel } from "@/prisma/types"

import { Schedule, Transfer } from "@/lib"

export type Column = {
	id: number
	key: string
	index: number
	width?: number
	item?: string
	from?: string
	frame?: string
	viewAs?: MinimalUserSocketModel
	schedule?: Schedule
	transfer?: Transfer
}
