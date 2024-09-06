import { FC, HTMLAttributes, PropsWithChildren, ReactNode } from "react"

import { Button } from "@/components/shared"
import { usePlugs, useSockets } from "@/contexts"
import { cn, greenGradientStyle, VIEW_KEYS } from "@/lib"

const Base: FC<
	PropsWithChildren<Omit<HTMLAttributes<HTMLDivElement>, "title" | "description">> & {
		title: ReactNode | JSX.Element | string
		description?: string
	}
> = ({ title, description, children, className, ...props }) => (
	<div className={cn("flex h-full flex-col items-center justify-center text-center font-bold", className)} {...props}>
		<p className="max-w-[280px]">{title}</p>
		{description && <p className="mt-2 max-w-[300px] text-sm opacity-40">{description}</p>}
		{children && <div className="mt-4 flex flex-row gap-2">{children}</div>}
	</div>
)

const Anonymous: FC<
	Omit<HTMLAttributes<HTMLDivElement>, "id" | "title" | "description"> & {
		id: string
		viewing: string
		isAbsolute?: boolean
	}
> = ({ id, viewing, isAbsolute = false, className, ...props }) => {
	const { isAnonymous, isExternal } = useSockets(id)

	if (isAnonymous === false || isExternal === true) return null

	return (
		<>
			{isAbsolute && (
				<div
					className="pointer-events-none absolute left-0 right-0 top-0 h-full bg-gradient-to-b"
					style={{
						backgroundImage: `linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,1), rgba(255,255,255,0.85), rgba(255,255,255,0))`
					}}
				/>
			)}

			<Base
				className={cn(isAbsolute && "absolute bottom-0 left-0 right-0 top-0", className)}
				title="Your are anonymous."
				description={`To view ${viewing} you must authenticate a wallet or select an account to view as.`}
				{...props}
			>
				<Button variant="secondary" sizing="sm" onClick={() => {}}>
					View As
				</Button>
				<Button sizing="sm" onClick={() => {}}>
					Login
				</Button>
			</Base>
		</>
	)
}

const EmptySearch: FC<
	Omit<HTMLAttributes<HTMLDivElement>, "title" | "description"> & {
		isEmpty: boolean
		search: string
		handleSearch: (data: string) => void
	}
> = ({ isEmpty, search, handleSearch, className, ...props }) => {
	if (isEmpty === false) return null

	return (
		<Base
			className={cn("absolute bottom-0 left-0 right-0 top-0", className)}
			title={
				<>
					No results for &lsquo;
					<span
						style={{
							...greenGradientStyle
						}}
					>
						{search}
					</span>
					&rsquo;.
				</>
			}
			description="Your search returned no results."
			{...props}
		>
			<Button sizing="sm" onClick={() => handleSearch("")}>
				Reset
			</Button>
		</Base>
	)
}

const EmptyAssets: FC<
	Omit<HTMLAttributes<HTMLDivElement>, "title" | "description"> & {
		isEmpty: boolean
		isViewing: string
		isReceivable: boolean
	}
> = ({ isEmpty, isViewing, isReceivable, className, ...props }) => {
	if (isEmpty === false) return null

	return (
		<>
			<div
				className="pointer-events-none absolute left-0 right-0 top-0 h-full bg-gradient-to-b"
				style={{
					backgroundImage: `linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,1), rgba(255,255,255,0.85), rgba(255,255,255,0))`
				}}
			/>

			<Base
				className={cn("absolute bottom-0 left-0 right-0 top-0", className)}
				title="Nothing to see here, yet."
				description={`When this account has ${isViewing} they will appear here.`}
				{...props}
			>
				<Button variant="secondary" sizing="sm" onClick={() => {}}>
					View As
				</Button>
				{isReceivable && (
					<Button sizing="sm" onClick={() => {}}>
						Receive
					</Button>
				)}
			</Base>
		</>
	)
}

const EmptyPlugs: FC<
	Omit<HTMLAttributes<HTMLDivElement>, "title" | "description"> & {
		id: string
		isEmpty: boolean
	}
> = ({ id, isEmpty, className, ...props }) => {
	if (isEmpty === false) return null

	return (
		<>
			<div
				className="pointer-events-none absolute left-0 right-0 top-0 h-full bg-gradient-to-b"
				style={{
					backgroundImage: `linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,1), rgba(255,255,255,0.85), rgba(255,255,255,0))`
				}}
			/>

			<Base
				className={cn("absolute bottom-0 left-0 right-0 top-0", className)}
				title="Nothing to see here, yet."
				description={" Go ahead and create a Plug from scratch or view the Plugs of another account."}
				{...props}
			>
				<Button variant="secondary" sizing="sm" onClick={() => {}}>
					View As
				</Button>
				<Button sizing="sm" onClick={() => {}}>
					Create
				</Button>
			</Base>
		</>
	)
}

export const Callout = Object.assign(Base, { Anonymous, EmptySearch, EmptyAssets, EmptyPlugs })
