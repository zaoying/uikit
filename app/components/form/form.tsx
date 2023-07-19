import { useIoC } from 'Com/app/hooks/ioc';
import { ChangeEventHandler, FC, HTMLInputTypeAttribute, ReactNode, useState } from 'react';

const {define, inject} = useIoC()

type ValueType = string | number | ReadonlyArray<string> | undefined
export type FieldProps = {
    name: string,
    label: string,
    value: ValueType,
    type?: HTMLInputTypeAttribute,
    onChange?: ChangeEventHandler,
    validator?: (val: ValueType) => boolean
}

export const Field: FC<FieldProps> = define((props) =>  (<>
        <label htmlFor={props.name} className="label">{props.label}</label>
        <input id={props.name} name={props.name} type={props.type} defaultValue={props.value} onChange={props.onChange}/>
    </>)
)

export type FormProps = {
    action?: string
    onSubmit?: () => boolean
    children?: ReactNode[]
}

export const Form: FC<FormProps> = define((props) => {
    return <form className='form' action={props.action} onSubmit={props.onSubmit}>
        {props.children?.map((field, index) => <div key={index} className='field'>{field}</div>)}
    </form>
})

export interface FormController {
    onSubmit(cb: () => boolean): void
    submit(): boolean
    reset(): void
    addField(fp: FieldProps, component?: FC<FieldProps>): void
}

function appendField<T>(p: FormProps, fp: FieldProps, component?: FC<FieldProps>): FormProps {
    const children = component ?? inject(Field, p)
    const field = children(fp)
    const fields = p.children ? [...p.children, field] : [field]
    return {...p, children: fields}
}

export function useForm(component?: FC<FormProps>): [ReactNode, FormController] {
    const form = component ?? inject(Form)
    const [props, setProps] = useState<FormProps>({children: []})
    const ctl: FormController = {
        onSubmit: (cb) => setProps(p => ({...p, onSubmit: cb})),
        submit: () => props.onSubmit ? props.onSubmit() : true,
        reset: () => setProps(p => ({...p, fields: []})),
        addField: (fp, component) => setProps(p => appendField(p, fp, component)),
    }
    return [form(props), ctl]
}