import { FC, useEffect } from "react"

import { PencilLine, Settings } from "lucide-react"

import { Button, Checkbox, Frame, Search } from "@/components"
import { useFrame, usePlugs, useSockets } from "@/contexts"
import { cardColors, useDebounce, useNavigation } from "@/lib"

export const ManagePlugFrame: FC<{ id: string }> = ({ id }) => {
	const { column } = useSockets(id)
	const { isFrame } = useFrame({ id, key: "manage" })
	const { plug, handle } = usePlugs(id)

	const [name, debouncedName, handleName, nameRef] = useDebounce(plug?.name ?? "", 1000)

	useEffect(() => {
		if (!plug || nameRef.current === debouncedName) return

		nameRef.current = debouncedName

		handle.plug.edit({ ...plug, name: debouncedName })
	}, [nameRef, plug, debouncedName, handle])

	if (!column || !plug) return null

	return (
		<Frame
			id={id}
			className="z-[2]"
			icon={<Settings size={18} />}
			label="Manage Plug"
			visible={isFrame}
			hasChildrenPadding={false}
		>
			<div className="mb-4 flex flex-col gap-4 px-6">
				<Search
					icon={<PencilLine size={14} />}
					placeholder="Plug name"
					search={name}
					handleSearch={handleName}
				/>

				<div className="flex flex-row items-center gap-2">
					<p className="mr-auto font-bold">Private</p>

					<Checkbox
						checked={plug.isPrivate}
						handleChange={(checked: boolean) =>
							handle.plug.edit({
								...plug,
								isPrivate: checked
							})
						}
					/>
				</div>

				<div className="flex flex-row items-center gap-2">
					<p className="font-bold">Color</p>

					<div className="ml-auto flex flex-wrap items-center gap-1">
						{Object.keys(cardColors).map(color => (
							<div
								key={color}
								className="group flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-[2px]"
								style={{
									borderColor:
										plug.color === color
											? cardColors[color as keyof typeof cardColors]
											: "transparent"
								}}
								onClick={() =>
									handle.plug.edit({
										...plug,
										color
									})
								}
							>
								<div
									className="h-full w-full rounded-full border-[2px] border-white transition-all duration-200 ease-in-out"
									style={{
										background: cardColors[color as keyof typeof cardColors]
									}}
								/>
							</div>
						))}
					</div>
				</div>

				<Button
					variant="destructive"
					className="w-full"
					onClick={() => handle.plug.delete({ plug: plug.id, id: column.id, from: column.from })}
				>
					Delete
				</Button>
			</div>
		</Frame>
	)
}
