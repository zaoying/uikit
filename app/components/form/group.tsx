import { FC, useEffect, useRef, useState } from "react"
import { Context, useIoC } from "~/hooks/ioc"
import { PropsDispatcher } from "../container"
import { FormPropsDispatcher, InputType, NewFormController } from "./form"

export interface GroupController {
    Update(cb: (p: GroupProps) => GroupProps): void
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
    values?: InputType[]
    validate?: (vals: Set<InputType>) => string
    onChange?: (vals: Set<InputType>) => void
    children: FC<{ctx: Context, name: string, onChange: (val: InputType, checked: boolean) => void}>
}

export const StepperPropsDispatcher: PropsDispatcher<GroupProps> = (props) => {}

export function NewGroupController(setProps: PropsDispatcher<GroupProps>): GroupController {
    return {
        Update(cb) {
            setProps(cb)
        }
    }
}

export const Group = (props: GroupProps) => {
    const context = useIoC()

    const values = useRef(new Set(props.values ?? []))

    const validate = function(...vals: InputType[]) {
        return props.validate && props.validate(new Set(vals))
    }

    const setForm = context.inject(FormPropsDispatcher)
    const ctl = NewFormController(setForm)
    useEffect(() => ctl.updateOrInsert({name: props.name, validate: validate}))

    const onChange = function(val: InputType, checked: boolean) {
        if (checked) {
            values.current.add(val)
        } else {
            values.current.delete(val);
        }
        const array = Array.from(values.current)
        const errMsg = validate(...array)
        ctl.updateOrInsert({name: props.name, validate: validate, errorMsg: errMsg})
        props.onChange && props.onChange(values.current)
    }

    return <div className="group">
        {props.children({ctx: context, name: props.name, onChange: onChange})}
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
