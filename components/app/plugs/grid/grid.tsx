import { FC } from "react"

import { Workflow } from "@prisma/client"

import { Animate, PlugGridItem } from "@/components"

type Props = React.HTMLAttributes<HTMLDivElement> & {
	id: string
	from: string
	plugs: Array<Workflow | undefined>
	count?: number
	handleReset?: () => void
}

export const PlugGrid: FC<Props> = ({ id, from, plugs, count, handleReset, ...props }) => (
	<div {...props}>
		<Animate.Grid>
			{plugs.slice(0, count || plugs.length).map((plug, index) => (
				<Animate.ListItem key={index}>
					<PlugGridItem id={id} from={from} plug={plug} />
				</Animate.ListItem>
			))}
		</Animate.Grid>
	</div>
)
