import { NewIoCContext, useIoC } from 'Com/app/hooks/ioc';
import { FC, useEffect } from 'react';
import { FormPropsDispatcher, InputType, NewFormController } from './form';

const {define} = NewIoCContext()

export type InputProps = {
    name: string
    id?: string
    value?: InputType
    type?: string
    placeholder?: string
    readonly?: boolean
    onChange?: (val: InputType) => void
    onBlur?: (e: any) => void
    validate?: (val: InputType) => string
}

function transformValue(val: InputType)  {
    if (val instanceof File) {
        return undefined
    }
    return val
}

export const Input: FC<InputProps> = define((props) => {    
    const context = useIoC()

    const validate = function(v: InputType) {
        return props.validate && props.validate(v)
    }

    const setForm = context.inject(FormPropsDispatcher)
    const ctl = NewFormController(setForm)
    useEffect(() => ctl.insert({name: props.name, validate: validate}))

    const onChange = function(e: any) {
        props.onChange && props.onChange(e.target.value)
        const errMsg = validate(e.target.value)
        const newItem = {name: props.name, validate: validate, errorMsg: errMsg}
        ctl.update(newItem)
    }
    return <input id={props.id} name={props.name} type={props.type} value={transformValue(props.value)} 
        onChange={onChange} onBlur={props.onBlur} placeholder={props.placeholder}
        readOnly={props.readonly}/>
})