import { IoCContext, useIoC as newIoC } from 'Com/app/hooks/ioc';
import { FC, useContext, useEffect, useState } from 'react';
import { SetLabelFor } from './label';

const {define} = newIoC("input")

export type InputProps<T> = {
    name: string
    value?: T
    type?: string
    placeholder?: string
    errorMsg?: string
    readonly?: boolean
    onChange?: (val: T) => void
    validate?: (val: T) => string
}

export const Input: FC<InputProps<any>> = define((old) => {
    const [props, setProps] = useState(old)
    
    const context = useContext(IoCContext)
    const setLabel = context.inject(SetLabelFor, old)
    useEffect(() => setLabel(props.name))
    
    const onChange: (e: any) => void = ((e) => {
        props.onChange && props.onChange(e.target.value)
        const errMsg = props.validate && props.validate(e.target.value)
        setProps(p => ({...p, errorMsg: errMsg}))
    });
    return <>
        <input id={props.name} name={props.name} type={props.type} value={props.value} 
            onChange={onChange} placeholder={props.placeholder}
            readOnly={props.readonly}/>
        {props.errorMsg && <span className="error">{props.errorMsg}</span>}
    </>
})