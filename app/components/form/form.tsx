import { FC, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { useIoC } from '~/hooks/ioc';
import { Controller, NameEqualizer, NewController, PropsDispatcher } from '../container';

export type InputType = string | File | ReadonlyArray<string> | number | undefined

export type FieldProps = {
    name: string
    validate: (val: InputType) => string | undefined
    errorMsg?: string
}

export type FormProps = {
    action?: string
    onSubmit?: (props: FormProps) => boolean
    validity?: boolean
    children?: ReactNode[]
}

interface FP {
    onSubmit?: (props: FormProps) => boolean
    validity?: boolean
    fields: FieldProps[]
}

export interface FormController extends Controller<FieldProps> {
    updateOrInsert(field: FieldProps): void
    submit(): void
    validate(formRef: RefObject<HTMLFormElement>, callback?: () => void): void
    reset(): void
}

export const FormPropsDispatcher: PropsDispatcher<FP> = (cb) => {}

export const FormReference: ({}) => RefObject<HTMLFormElement> = () => useRef<HTMLFormElement>(null)

export function NewFormController(setProps: PropsDispatcher<FP>): FormController {
    const setOptions: PropsDispatcher<FieldProps[]> = (action) => setProps(p => {
        const fields = (typeof action == "function") ? action(p.fields) : action
        return {...p, fields: fields}
    })
    const ctl = NewController<FieldProps>(setOptions, NameEqualizer)
    return {
        ...ctl,
        updateOrInsert(field) {
            setProps(p => {
                const index = p.fields.findIndex(f => f.name == field.name)
                if (index >= 0) {
                    p.fields[index] = field
                    return {...p, fields: [...p.fields]}
                }
                return {...p, columns: [...p.fields, field]}
            })
        },
        submit() {
            setProps(p => {
                p.onSubmit && p.onSubmit(p);
                return p
            })
        },
        validate(formRef, callback) {
            if (formRef.current) {
                const formData = new FormData(formRef.current)
                setProps(p => {
                    const fields = p.fields.map(field => {
                        const val = formData.get(field.name)
                        const errMsg = field.validate(val ?? "")
                        return {...field, errorMsg: errMsg}
                    })
                    const validity = fields.filter(field => field.errorMsg).length == 0
                    validity && callback && callback()
                    return {...p, fields: fields, validity: validity}
                })
            }
        },
        reset: () => setProps(p => ({...p, fields: []}))
    }
}

export const Form: FC<FormProps> = (old) => {
    const formRef = useRef<HTMLFormElement>(null)
    const [props, setProps] = useState<FP>({...old, fields: []})
    const context = useIoC()
    context.define(FormPropsDispatcher, setProps)
    useEffect(() => {context.define(FormReference, () => formRef)})
    
    const children = old.children?.map((child, index) => {
        const field = props.fields.at(index)
        const key = field?.name || index;
        return <div key={key} className='field'>
            {child}
            {field?.errorMsg && <span className="error">{field.errorMsg}</span>}
        </div>
    })
    const onSubmit = (e: any) => {
        // Prevent the browser from reloading the page
        e.preventDefault();
        return props.onSubmit && props.onSubmit(props)
    }
    return <form ref={formRef} className='form' action={old.action} onSubmit={onSubmit}>
        {children}
    </form>
}