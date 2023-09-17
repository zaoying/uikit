import { FC, ReactNode, useEffect, useId, useState } from 'react';
import { InputType } from './form';

export type RadioProps = {
    name: string
    value?: string | ReadonlyArray<string> | number | undefined
    disabled?: boolean
    readonly?: boolean
    checked?: boolean
    onChange?: (val: InputType) => void
    children: ReactNode
}

export const Radio: FC<RadioProps> = (props) => {
    const [checked, setChecked] = useState(props.checked ?? false)
    const onChange = function(e: any) {
        props.onChange && props.onChange(e.target.value)
        setChecked(flag => !flag)
    }
    useEffect(() => setChecked(props.checked ?? false), [props])

    const id = useId()
    return <div className="radio">
        <input id={id} name={props.name} type="radio" onChange={onChange} value={props.value}
             disabled={props.disabled} readOnly={props.readonly} checked={checked}/>
        <label htmlFor={id}>{props.children}</label>
    </div>
}