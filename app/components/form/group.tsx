import { FC, useEffect, useState } from "react"
import { Context, useIoC } from "~/hooks/ioc"
import { PropsDispatcher } from "../container"
import { FormPropsDispatcher, InputType, NewFormController } from "./form"

export interface GroupController {
    name: string
    onChange?: (val: InputType) => void
}

function calSelected(items: Map<string, boolean>) {
    let selected: string[] = [];
        items.forEach((val, key) => val && selected.push(key))
    return selected
}

function allSelected(all: Map<string,boolean>) {
    const selected = calSelected(all)
    return selected.length > 0 && selected.length == all.size
}

export type GroupProps = {
    name: string
    validate?: (val: InputType) => string
    children: FC<{ctx: Context, name: string}>
}

export const StepperPropsDispatcher: PropsDispatcher<GroupProps> = (props) => {}

export function NewGroupController(setProps: PropsDispatcher<GroupProps>): GroupController {
    return {
        name: "",
        onChange: () => {}
    }
}

export const Group = (props: GroupProps) => {
    const context = useIoC()

    const validate = function(v: InputType) {
        return props.validate && props.validate(v)
    }

    const setForm = context.inject(FormPropsDispatcher)
    const ctl = NewFormController(setForm)
    useEffect(() => ctl.updateOrInsert({name: props.name, validate: validate}))

    return <div className="group">
        {props.children({ctx: context, name: props.name})}
    </div>
}

export type CheckboxGroupProps = {
    onChange: (selected: string[]) => void
    children: FC<{
        allSelected: boolean
        toggleAll: () => void,
        toggle: (id: string) => (val: InputType) => void,
        init: (id: string) => boolean,
        reset: () => void
    }>
}

export const CheckboxGroup = (props: CheckboxGroupProps) => {
    const [items, setItems] = useState(new Map<string, boolean>())
    useEffect(() => {
        const selected = calSelected(items)
        props.onChange(selected)
    }, [items, props])
    const toggleAll = () => {
        setItems(all => {
            const newMap = new Map<string, boolean>()
            const checked = allSelected(all)
            all.forEach((val, key) => {
                newMap.set(key, !checked)
            })
            return newMap
        })
    }
    const toggle = (id: string) => (
        (val: InputType) => {
            setItems(all => {
                const newMap = new Map<string, boolean>()
                all.forEach((val, key) => {
                    newMap.set(key, val)
                })
                const state = all.get(id) ?? false
                newMap.set(id, !state)
                return newMap
            })
        }
    )

    const init = (id: string) => {
        if (!items.has(id)) {
            items.set(id, false)
        }
        return items.get(id) ?? false
    }

    const reset = () => setItems(new Map<string, boolean>())
    return props.children({allSelected: allSelected(items), toggleAll, toggle, init, reset})
}
