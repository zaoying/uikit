import { Context, useIoC } from "Com/app/hooks/ioc"
import { FC, useEffect } from "react"
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
    useEffect(() => ctl.insert({name: props.name, validate: validate}))

    return <div className="group">
        {props.children({ctx: context, name: props.name})}
    </div>
}