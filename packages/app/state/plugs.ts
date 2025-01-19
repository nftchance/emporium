import { useSession } from "next-auth/react"
import { useMemo } from "react"

import { atom, useAtom, useAtomValue } from "jotai"

import { Workflow } from "@prisma/client"

import { Actions } from "@/lib"
import { tags } from "@/lib/constants"
import { api } from "@/server/client"

import { COLUMNS, useColumnStore } from "./columns"
import { atomWithStorage } from "jotai/utils"

export const plugsAtom = atom<Workflow[]>([])
export const searchAtom = atom("")
export const tagAtom = atom<(typeof tags)[number]>(tags[0])
export const viewedPlugsAtom = atomWithStorage<Set<string>>("plug.viewed", new Set<string>())

export const workflowByIdAtom = atom(get => (id: string) => get(plugsAtom).find(plug => plug.id === id))

export const ACTION_REGEX = /({\d+(?:=>\d+)?})/g

export type WorkflowData = Pick<Workflow, "name" | "color" | "isPrivate">
export type Option = {
	label: string
	value: string | number
	icon: string
}
export type Value = string | Option | undefined | null

export const spreadPlugs = (plugs: Array<Workflow> | undefined, plug: Workflow) => (!plugs ? [plug] : [plug, ...plugs])

const usePlugActions = () => {
	const { columns, handle } = useColumnStore()

	const [plugs, setPlugs] = useAtom(plugsAtom)

	const addMutation = api.plugs.add.useMutation({
		onSuccess: result => {
			if (!plugs?.find(plug => plug.id === result.plug.id)) setPlugs(prev => spreadPlugs(prev, result.plug))

			console.log(result)

			if (result.index !== undefined)
				handle.navigate({
					key: COLUMNS.KEYS.PLUG,
					index: result.index,
					from: result.from,
					item: result.plug.id
				})
			else
				handle.add({
					index: columns[columns.length - 1].index + 1,
					key: COLUMNS.KEYS.PLUG,
					from: result.from,
					item: result.plug.id
				})
		}
	})

	const editMutation = api.plugs.edit.useMutation({
		onSuccess: result =>
			setPlugs(prev => prev.map(p => (p.id === result.id ? { ...p, ...result, updatedAt: new Date() } : p)))
	})

	const deleteMutation = api.plugs.delete.useMutation({
		onSuccess: (result, variables) => {
			setPlugs(prev => prev.filter(plug => plug.id !== variables.plug))

			handle.navigate({
				key: COLUMNS.KEYS.MY_PLUGS,
				index: result.index
			})

			handle.frame()
		}
	})

	const forkMutation = api.plugs.fork.useMutation({
		onSuccess: result => {
			if (!plugs?.find(plug => plug.id === result.plug.id)) setPlugs(prev => spreadPlugs(prev, result.plug))

			handle.navigate({
				key: COLUMNS.KEYS.PLUG,
				index: result.index,
				from: result.from,
				item: result.plug.id
			})
		}
	})

	const queueMutation = api.plugs.activity.queue.useMutation({
		onSuccess: result =>
			setPlugs(prev =>
				prev.map(p => (p.id === result.id ? { ...p, queuedAt: new Date(), frequency: result.frequency } : p))
			)
	})

	return {
		add: addMutation.mutate,
		edit: editMutation.mutate,
		delete: deleteMutation.mutate,
		fork: forkMutation.mutate,
		queue: queueMutation.mutate
	}
}

export const usePlugSubscriptions = () => {
	const session = useSession()
	const [, setPlugs] = useAtom(plugsAtom)

	api.plugs.onAdd.useSubscription(undefined, {
		enabled: Boolean(session.data),
		onData: data => setPlugs(prev => spreadPlugs(prev, data))
	})

	api.plugs.onEdit.useSubscription(undefined, {
		enabled: Boolean(session.data),
		onData: data =>
			setPlugs(prev => prev.map(p => (p.id === data.id && p.updatedAt < data.updatedAt ? { ...p, ...data } : p)))
	})

	api.plugs.onDelete.useSubscription(undefined, {
		enabled: Boolean(session.data),
		onData: data => setPlugs(prev => prev.filter(plug => plug.id !== data.id))
	})
}

export const usePlugStore = (id?: string, action?: { protocol: string; action: string }) => {
	const session = useSession()
	const { columns } = useColumnStore()

	const [plugs, setPlugs] = useAtom(plugsAtom)
	const [search, setSearch] = useAtom(searchAtom)
	const [tag, setTag] = useAtom(tagAtom)
	const [viewedPlugs, setViewedPlugs] = useAtom(viewedPlugsAtom)

	const ids = (columns?.map(column => column?.item).filter(Boolean) as string[]) || []

	const { data: solverActions } = api.solver.actions.getSchemas.useQuery(
		{ protocol: action?.protocol, action: action?.action, chainId: 1 },
		{ enabled: Boolean(action) }
	)

	api.plugs.all.useQuery(
		{ target: "mine" },
		{
			enabled: Boolean(session.data),
			onSuccess: data =>
				setPlugs(prev => {
					const uniqueData = data.filter(d => !prev.some(p => p.id === d.id))
					return [...prev, ...uniqueData]
				})
		}
	)

	api.plugs.get.useQuery(
		{ ids, viewed: Array.from(viewedPlugs) },
		{
			enabled: Boolean(session.data) && ids.length > 0,
			onSuccess: data => {
				setPlugs(prev => {
					const uniqueData = data.filter(d => !prev.some(p => p.id === d.id))
					return [...prev, ...uniqueData]
				})
				setViewedPlugs(prev => {
					const newSet = new Set([...Array.from(prev)].slice(-49))
					data.forEach(plug => newSet.add(plug.id))
					if (newSet.size > 50) {
						const entries = Array.from(newSet)
						newSet.clear()
						entries.slice(-50).forEach(id => newSet.add(id))
					}
					return newSet
				})
			}
		}
	)

	const plug = plugs.find(p => p.id === id)
	const own = (plug && session.data && session.data.address === plug.socketId) || false
	const actions: Actions = useMemo(() => {
		if (!plug) return []
		try {
			return JSON.parse(plug.actions)
		} catch {
			return []
		}
	}, [plug])

	const actionMutation = api.plugs.action.edit.useMutation({
		onSuccess: result => setPlugs(prev => prev.map(p => (p.id === result.id ? { ...p, ...result } : p)))
	})

	return {
		plugs,
		plug,
		own,
		actions,
		search,
		tag,
		handle: {
			search: setSearch,
			tag: setTag,
			plug: usePlugActions(),
			action: {
				edit: actionMutation.mutate
			}
		},
		solver: {
			actions: solverActions
		}
	}
}

export const usePlugData = (id?: string) => {
	const getWorkflowById = useAtomValue(workflowByIdAtom)
	const plug = id ? getWorkflowById(id) : undefined
	const session = useSession()

	const own = plug && session.data && session.data.address === plug.socketId
	const actions: Actions = useMemo(() => {
		if (!plug) return []
		try {
			return JSON.parse(plug.actions)
		} catch {
			return []
		}
	}, [plug])

	return { plug, own, actions }
}
