import { FC, ReactNode, useId } from 'react';
import { InputType } from './form';

export type CheckBoxProps = {
    name: string
    value?: string | ReadonlyArray<string> | number | undefined
    disabled?: boolean
    readonly?: boolean
    checked?: boolean
    onChange?: (val: InputType) => void
    children: ReactNode
}

export const CheckBox: FC<CheckBoxProps> = (props) => {
    const onChange = function(e: any) {
        props.onChange && props.onChange(e.target.value)
    }

    const id = useId()
    return <div className="checkbox">
        <input id={id} name={props.name} type="checkbox" onChange={onChange} value={props.value}
            disabled={props.disabled} readOnly={props.readonly} checked={props.checked}/>
        <label htmlFor={id}>{props.children}</label>
    </div>
}