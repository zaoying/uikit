import { FC, ReactNode, useEffect, useId, useState } from 'react';
import { InputType } from './form';

export type CheckBoxProps = {
    name: string
    value?: string | ReadonlyArray<string> | number | undefined
    disabled?: boolean
    readonly?: boolean
    checked?: boolean
    onChange?: (val: InputType) => void
    children?: ReactNode
}

export const CheckBox: FC<CheckBoxProps> = (props) => {
    const [checked, setChecked] = useState(props.checked ?? false)
    const onChange = function(e: any) {
        setChecked(flag => !flag)
        props.onChange && props.onChange(e.target.value)
    }
    useEffect(() => setChecked(props.checked ?? false), [props])

    const id = useId()
    return <div className="checkbox">
        <input id={id} name={props.name} type="checkbox" onChange={onChange} value={props.value}
            disabled={props.disabled} readOnly={props.readonly} checked={checked}/>
        <label htmlFor={id}>{props.children}</label>
    </div>
}