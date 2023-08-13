import { IoCContext, NewIoCContext } from 'Com/app/hooks/ioc';
import { FC, useContext, useEffect } from 'react';
import { FormPropsDispatcher, InputType, NewFormController } from './form';
import { GetLabelID } from './label';

const {define} = NewIoCContext()

export type InputProps = {
    name: string
    value?: InputType
    type?: string
    placeholder?: string
    readonly?: boolean
    onChange?: (val: InputType) => void
    validate?: (val: InputType) => string
}

export const Input: FC<InputProps> = define((props) => {    
    const context = useContext(IoCContext)
    const labelId = context.inject(GetLabelID)({})

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
    return <>
        <input id={labelId} name={props.name} type={props.type} value={props.value} 
            onChange={onChange} placeholder={props.placeholder}
            readOnly={props.readonly}/>
    </>
})