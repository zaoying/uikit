import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useIoC } from '~/hooks/ioc';
import { FormPropsDispatcher, InputType, NewFormController } from './form';

export type InputProps = {
    name: string
    id?: string
    value?: InputType
    type?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    onChange?: (val: InputType) => void
    onBlur?: (e: ChangeEvent<HTMLInputElement>) => void
    validate?: (val: InputType) => string
}

export const Input: FC<InputProps> = (props) => {
    const context = useIoC()

    const validate = function(v: InputType) {
        return props.validate && props.validate(v)
    }

    const [value, setValue] = useState(props.value)
    useEffect(() => setValue(props.value), [props])

    const setForm = context.inject(FormPropsDispatcher)
    const ctl = NewFormController(setForm)
    useEffect(() => ctl.updateOrInsert({name: props.name, validate: validate}))

    const onChange = function(e: ChangeEvent<HTMLInputElement>) {
        props.onChange && props.onChange(e.target.value)
        const errMsg = validate(e.target.value)
        const newItem = {name: props.name, validate: validate, errorMsg: errMsg}
        ctl.update(newItem)
        setValue(e.target.value)
    }
    const typ = props.type ?? "text"
    return <input id={props.id} name={props.name} type={typ} value={value} 
        onChange={onChange} onBlur={props.onBlur} placeholder={props.placeholder}
        readOnly={props.readonly} disabled={props.disabled}/>
}