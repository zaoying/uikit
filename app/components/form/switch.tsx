import { FC, useEffect, useState } from "react"
import { useIoC } from "~/hooks/ioc"
import { FormPropsDispatcher, InputType, NewFormController } from "./form"

export type SwitchProps = {
    name: string
    id?: string
    checked?: boolean
    disabled?: boolean
    readonly?: boolean
    value?: string | ReadonlyArray<string> | number | undefined
    onToggle?: (flag?: boolean) => boolean
    validate?: (val: InputType) => string
}

export const Switch: FC<SwitchProps> = (props) => {
    const context = useIoC()

    const validate = function(v: InputType) {
        return props.validate && props.validate(v)
    }

    const setForm = context.inject(FormPropsDispatcher)
    const ctl = NewFormController(setForm)
    useEffect(() => ctl.updateOrInsert({name: props.name, validate: validate}))
    
    const [flag, setFlag] = useState(props.checked)
    const onClick = (e: any) => {
        props.readonly || setFlag(f => props.onToggle ? props.onToggle(f) : !f)
    }
    const className = `switch ${flag ? "active" : ""}`
    return <button type="button" className={className} name={props.name} value={props.value} id={props.id} 
        onClick={onClick} disabled={props.disabled}>
            <span className="dot"></span>
    </button>
}