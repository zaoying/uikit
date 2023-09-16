import { FC, useEffect, useState } from "react"
import { Context, useIoC } from "~/hooks/ioc"
import { PropsDispatcher } from "../container"
import { FormPropsDispatcher, InputType, NewFormController } from "./form"

export interface GroupController {
    name: string
    onChange?: (val: InputType) => void
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
    children: FC<{
        items: Map<string, boolean>,
        allSelected: boolean,
        toggleAll: () => void,
        toggle: (id: string) => (val: InputType) => void,
        init: (id: string) => boolean
    }>
}

export const CheckboxGroup = (props: CheckboxGroupProps) => {
    const [items, setItems] = useState(new Map<string, boolean>())
    let selected = 0;
    items.forEach(val => val && selected++)
    const allSelected = items.size > 0 && selected == items.size
    const toggleAll = () => setItems(all => {
        const newMap = new Map<string, boolean>()
        all.forEach((val, key) => {
            newMap.set(key, !allSelected)
        })
        return newMap
    })
    const toggle = (id: string) => (
        (val: InputType) => {
            setItems(s => {
                const checked = s.get(id) ?? false
                s.set(id, !checked)
                return new Map<string, boolean>(s.entries())
            })
        }
    )

    const init = (id: string) => {
        if (!items.has(id)) {
            items.set(id, false)
        }
        return items.get(id) ?? false
    }
    return props.children({items, allSelected, toggleAll, toggle, init})
}