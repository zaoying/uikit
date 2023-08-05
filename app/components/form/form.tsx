import { NewIoCContext } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useState } from 'react';
import { PropsDispatcher, UniqueController } from '../container';
import { FieldProps } from './field';

const {define, inject} = NewIoCContext("form")

export type FormProps = {
    action?: string
    onSubmit?: (props: FormProps) => boolean
    fields?: FieldProps[]
    children?: ReactNode[]
}

export interface FormController extends UniqueController<FieldProps> {
    onSubmit(cb: (props: FormProps) => boolean): void
    reset(): void
}

export const FormPropsDispatcher: PropsDispatcher<FormProps> = define((cb) => {})

export function NewFormController(setProps: PropsDispatcher<FormProps>): FormController {
    return {
        insert({name, children}) {
            setProps(p => {
                if (!p.fields) {
                    const field = { name, children }
                    return {...p, fields: [field]}
                }
                if (p.fields.find(field => field.name == name)) {
                    return p
                }
                const field = { name, children }
                return {...p, fields: [...p.fields, field]}
            })
            
        },
        update({name, children}) {
            const replace = (fields: FieldProps[]) => {
                const field = { name, children }
                const filtered = fields.filter(field => field.name != name)
                return [...filtered, field]
            }
            setProps(p => ({...p, fields: p.fields ? replace(p.fields) : p.fields}))
        },
        remove(name) {
            setProps(p => ({...p, fields: p.fields ? p.fields.filter((field) => field.name != name) : p.fields}))
        },
        onSubmit: (cb) => setProps(p => ({...p, onSubmit: cb})),
        reset: () => setProps(p => ({...p, fields: []}))
    }
}

export const Form: FC<FormProps> = define((old) => {
    const [props, setProps] = useState(old)
    define(FormPropsDispatcher, setProps)
    
    const children = props.fields?.length ? props.fields?.map((field) => 
                <div key={field.name} className="field" > {field.children}</div>
            ) : props.children?.map((child, index) =>
                <div key={index} className='field'>{child}</div>
            )
    const onSubmit = () => props.onSubmit && props.onSubmit(props)
    return <form className='form' action={props.action} onSubmit={onSubmit}>
        {children}
    </form>
})