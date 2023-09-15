import { FC, useEffect, useState } from 'react';
import { useIoC } from '~/hooks/ioc';
import { FormPropsDispatcher, InputType, NewFormController } from './form';

export type SpinnerProps = {
    name: string
    value: number
    min: number
    max: number
    step?: number
    id?: string
    disabled?: boolean
    readonly?: boolean
    onChange?: (val: InputType) => void
    onBlur?: (e: any) => void
    validate?: (val: InputType) => string
}

export const Spinner: FC<SpinnerProps> = (props) => {
    const context = useIoC()
    const [value, setValue] = useState(props.value)

    const validate = function(v: InputType) {
        return props.validate && props.validate(v)
    }

    const setForm = context.inject(FormPropsDispatcher)
    const ctl = NewFormController(setForm)
    useEffect(() => ctl.updateOrInsert({name: props.name, validate: validate}))

    const onChange = (val: number) => {        
        setValue(val)
        props.onChange && props.onChange(val)
        const errMsg = validate(val)
        const newItem = {name: props.name, validate: validate, errorMsg: errMsg}
        ctl.update(newItem)
    }

    const step = props.step ?? 1
    const minus = (e: any) => setValue(val => {
        const result = val - step
        return result > props.min ? result : props.min
    })
    const plus = (e: any) => setValue(val => {
        const result = val + step
        return result < props.max ? result : props.max
    })
    return <div className="spinner">
        <button className="icon" type="button" onClick={minus} disabled={value <= props.min}>-</button>
        <input id={props.id} name={props.name} type="number" value={value} 
            onChange={(e: any) => onChange(e.target.value)} onBlur={props.onBlur}
            min={props.min} max={props.max} readOnly={props.readonly} disabled={props.disabled}/>
        <button className="icon" type="button" onClick={plus} disabled={value >= props.max}>+</button>
    </div>
}