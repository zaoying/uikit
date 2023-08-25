import { Dispatch, FC, SetStateAction, useState } from "react"
import { Context, useIoC } from "../hooks/ioc"

export type WithDependencyProps<D extends {}> = {
    deps: D,
    context?: Context
    children: FC<{deps: D}>
}

export const WD = WithDependency

export function WithDependency<D extends {}>(props: WithDependencyProps<D>) {
    const parent = useIoC()
    const context = props.context ?? parent
    const deps = Object.assign({}, props.deps)
    const keys = Object.keys(props.deps) as (keyof typeof props.deps)[]
    for (const key of keys) {
        const field = props.deps[key]
        const subType = context.inject(field)
        Object.assign(deps, {key: subType})
    }
    return props.children({deps})
}

export type StateProps<S> = {
    state: S
    children: FC<{state: S, setState: Dispatch<SetStateAction<S>>}>
}

export const WS = WithState

export function WithState<S>(props: StateProps<S>) {
    const [state, setState] = useState(props.state)
    return props.children({state, setState})
}
