import { FC, ReactNode, useEffect, useState } from "react"
import { useIoC } from "~/hooks/ioc"
import { FormPropsDispatcher, InputType, NewFormController } from "./form"

export type SwitchProps = {
    name: string
    id?: string
    checked?: boolean
    disabled?: boolean
    readonly?: boolean
    value?: string | ReadonlyArray<string> | number | undefined
    onToggle?: (flag: boolean) => void
    validate?: (val: InputType) => string
    children?: ReactNode
}

export const Switch: FC<SwitchProps> = (props) => {
    const context = useIoC()

    const validate = function(v: InputType) {
        return props.validate && props.validate(v)
    }

    const setForm = context.inject(FormPropsDispatcher)
    const ctl = NewFormController(setForm)
    useEffect(() => ctl.updateOrInsert({name: props.name, validate: validate}))
    
    const [flag, setFlag] = useState(props.checked ?? false)
    const onClick = (e: any) => {
        if (props.readonly) {
            return
        }
        setFlag(f => !f)
        props.onToggle && props.onToggle(flag) 
    }
    const className = `switch ${flag ? "active" : ""}`
    const on = <span className="label">On</span>
    const off = <span className="label">Off</span>
    const label = flag ? on : off
    const children = <>
        {label}
        <span className="dot" style={{backgroundColor: "white"}}></span>
    </>
    return <button type="button" className={className} name={props.name} value={props.value}
        id={props.id} onClick={onClick} disabled={props.disabled}>
            {props.children ?? children}
    </button>
}