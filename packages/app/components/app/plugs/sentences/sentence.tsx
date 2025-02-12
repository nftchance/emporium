import { FC, HTMLAttributes, memo, useState } from "react"
import { motion } from "framer-motion"

import { X } from "lucide-react"

import { Image } from "@/components/app/utils/image"
import { Button } from "@/components/shared/buttons/button"
import { Accordion } from "@/components/shared/utils/accordion"
import { Action, cn, useCord } from "@/lib"
import { useColumnStore } from "@/state/columns"
import { usePlugStore } from "@/state/plugs"
import { HandleValueProps, Part } from "./part"

type SentenceProps = HTMLAttributes<HTMLButtonElement> & {
	index: number
	item: string
	preview?: boolean
	error?: boolean
	action: Action
	actionIndex: number,
}

export const Sentence: FC<SentenceProps> = memo(({
	index,
	item,
	action,
	actionIndex,
	preview = false,
	error = false,
	className,
	...props
}) => {
	const [search, setSearch] = useState<Record<number, string | undefined>>({})

	const { column, handle: { frame } } = useColumnStore(index)
	const {
		own,
		actions: plugActions,
		handle: {
			action: { edit }
		},
		solver: { actions: solverActions }
	} = usePlugStore(item, { protocol: action.protocol, action: action.action, search })

	const actionSchema = solverActions ? solverActions[action.protocol] : undefined
	const sentence = actionSchema ? actionSchema.schema[action.action].sentence : ""
	const options = actionSchema ? actionSchema.schema[action.action].options : undefined

	const values = Object.entries(action.values ?? []).reduce(
		(acc, [key, value]) => {
			if (value) {
				acc[key] = value.value
			}
			return acc
		},
		{} as Record<string, string>
	)

	const {
		state: { parsed },
		actions: { setValue },
		helpers: { getInputValue, getInputError, isValid, isComplete }
	} = useCord(sentence, values)

	const parts = parsed
		? parsed.template
			.split(/(\{[^}]+\})/g)
			.map(part => {
				if (part.match(/\{[^}]+\}/)) return [part]
				return part.split(/(\s+)/g)
			})
			.flat()
		: []

	const handleValue = ({ index, value, isNumber, ...rest }: HandleValueProps) => {
		setValue(index, value)

		edit({
			id: item,
			actions: JSON.stringify(
				plugActions.map((action, nestedActionIndex) => ({
					...action,
					values:
						nestedActionIndex === actionIndex
							? {
								...action.values,
								[index]: {
									...rest,
									value: isNumber ? parseFloat(value) : value,
								}
							}
							: action.values
				}))
			)
		})
	}

	if (!column) return null

	if (!solverActions || !actionSchema) return <motion.div
		className="h-16 mb-2 border-[1px] border-plug-green/10 rounded-lg p-4 animate-loading bg-gradient-animated bg-[length:200%_200%"
		initial={{ y: 20 }}
		animate={{ y: 0 }}
	>
		<p className="font-bold hidden py-4">.</p>
	</motion.div>

	if (!parsed) return <motion.div
		className="mb-2 border-[1px] border-plug-red rounded-lg p-4"
		initial={{ y: 20 }}
		animate={{ y: 0 }}
	>
		<p className="font-bold text-plug-red">Failed to parse: <span className="opacity-60">{sentence}</span></p>
	</motion.div>

	return (
		<motion.div initial={{ y: 20 }} animate={{ y: 0 }}>
			<Accordion
				className={cn(
					"cursor-default hover:bg-white",
					isValid && isComplete && !error
						? "border-plug-yellow hover:border-plug-yellow"
						: "border-plug-red hover:border-plug-red",
					className
				)}
				data-sentence
				data-chains={actionSchema?.metadata.chains.join(",") ?? ""}
				data-valid={isValid && isComplete}
				data-action-preview={item}
				{...props}
			>
				<div className={cn("flex flex-row items-center font-bold")}>
					<div className="flex w-full flex-wrap items-center gap-[4px]">
						<div className="flex flex-row items-start gap-[4px]">
							<div className="relative mt-1 h-6 w-10 flex-shrink-0">
								<Image
									className="absolute mr-2 h-6 w-6 rounded-sm blur-xl filter"
									src={actionSchema.metadata.icon}
									alt={`Icon for ${action.protocol}`}
									width={64}
									height={64}
								/>
								<Image
									className="absolute mr-2 h-6 w-6 rounded-sm"
									src={actionSchema.metadata.icon}
									alt={`Icon for ${action.protocol}`}
									width={64}
									height={64}
								/>
							</div>

							<div className="flex flex-wrap items-center gap-y-1">
								{!solverActions && <p>Failed to retrieve action schema: {action.protocol}</p>}

								{solverActions && parts.map((part, partIndex) => {
									const match = part.match(/\{(\d+)(?:=>(\d+))?\}/)

									if (!match)
										return (
											<span key={partIndex} className="whitespace-pre">
												{part}
											</span>
										)

									const inputIndex = parseInt(match[2] || match[1])
									const optionsIndex = match[2] ? parseInt(match[1]) : inputIndex
									const input = parsed.inputs.find(i => i.index === inputIndex)

									if (!input) return null

									return (
										<Part
											key={`${index}-${actionIndex}-${actionIndex}-${partIndex}`}
											index={index}
											column={column}
											frame={frame}
											own={own}
											preview={preview}
											error={error}
											actionIcon={actionSchema.metadata.icon}
											action={action}
											actionIndex={actionIndex}
											parsed={parsed}
											input={input}
											inputIndex={inputIndex}
											optionsIndex={optionsIndex}
											options={options}
											getInputValue={getInputValue}
											getInputError={getInputError}
											search={search}
											handleSearch={(s, index) => setSearch(prev => ({ ...prev, [parseInt(String(index))]: s ?? undefined }))}
											handleValue={handleValue}
										/>

									)
								})}
							</div>
						</div>
					</div>

					{preview === false && own && (
						<Button
							variant="secondary"
							className="mb-auto ml-4 mt-[4px] rounded-sm p-1"
							onClick={() =>
								edit({
									id: item,
									actions: JSON.stringify(plugActions.filter((_, i) => i !== actionIndex))
								})
							}
						>
							<X size={14} className="opacity-60" />
						</Button>
					)}
				</div>
			</Accordion>

			{actionIndex < plugActions.length - 1 && (
				<div
					className={cn(
						"mx-auto h-2 w-[2px]",
						isValid && isComplete && !error
							? "bg-plug-yellow hover:border-plug-yellow"
							: "bg-plug-red hover:border-plug-red"
					)}
				/>
			)}
		</motion.div>
	)
})

Sentence.displayName = "Sentence"
