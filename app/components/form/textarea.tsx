import { useIoC } from 'Com/app/hooks/ioc';
import { FC, useEffect, useId } from 'react';
import { FormPropsDispatcher, InputType, NewFormController } from './form';

export type TextareaProps = {
    name: string
    id?: string
    value?: string | ReadonlyArray<string> | number | undefined
    disabled?: boolean
    readonly?: boolean
    placeholder?: string
    cols?: number
    rows?: number
    minLen?: number
    maxLen?: number
    onChange?: (val: InputType) => void
    validate?: (val: InputType) => string
}

export const Textarea: FC<TextareaProps> = (props) => {
    const context = useIoC()

    const validate = function(v: InputType) {
        return props.validate && props.validate(v)
    }

    const setForm = context.inject(FormPropsDispatcher)
    const ctl = NewFormController(setForm)
    useEffect(() => ctl.insert({name: props.name, validate: validate}))
    
    const onChange = function(e: any) {
        props.onChange && props.onChange(e.target.value)
    }

    const id = useId()
    return <textarea className="textarea" id={id} name={props.name} onChange={onChange}
        value={props.value} disabled={props.disabled} readOnly={props.readonly} 
        placeholder={props.placeholder} rows={props.rows} cols={props.cols}
        maxLength={props.maxLen} minLength={props.minLen}>
    </textarea>
}