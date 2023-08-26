import { useIoC } from 'Com/app/hooks/ioc';
import { FC, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { PropsDispatcher, UniqueController } from '../container';

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
    fields?: FieldProps[]
    children?: ReactNode[]
}

export interface FormController extends UniqueController<FieldProps> {
    submit(): void
    validate(formRef: RefObject<HTMLFormElement>): void
    reset(): void
}

export const FormPropsDispatcher: PropsDispatcher<FormProps> = (cb) => {}

export const FormReference: ({}) => RefObject<HTMLFormElement> = () => useRef<HTMLFormElement>(null)

export function NewFormController(setProps: PropsDispatcher<FormProps>): FormController {
    return {
        insert(field) {
            setProps(p => {
                if (!p.fields) {
                    return {...p, fields: [field]}
                }
                if (p.fields.find(f => f.name == field.name)) {
                    return p
                }
                return {...p, fields: [...p.fields, field]}
            })
            
        },
        update(field) {
            const replace = (fields?: FieldProps[]) => {
                return fields ? fields.map(f => f.name == field.name ? field : f) : fields
            }
            setProps(p => ({...p, fields: replace(p.fields)}))
        },
        remove(name) {
            const filter = (fields: FieldProps[]) => fields.filter(field => field.name != name)
            setProps(p => ({...p, fields: p.fields ? filter(p.fields) : p.fields}))
        },
        submit() {
            setProps(p => {
                p.onSubmit && p.onSubmit(p);
                return p
            })
        },
        validate(formRef) {
            if (formRef.current) {
                const formData = new FormData(formRef.current)
                setProps(p => {
                    if (!p.fields) {
                        return {...p, validity: true}
                    }
                    const fields = p.fields.map(field => {
                        const val = formData.get(field.name)
                        const errMsg = field.validate(val ?? "")
                        return {...field, errorMsg: errMsg}
                    })
                    const validity = fields.filter(field => field.errorMsg).length == 0
                    return {...p, fields: fields, validity: validity}
                })
            }
        },
        reset: () => setProps(p => ({...p, fields: []}))
    }
}

export const Form: FC<FormProps> = (old) => {
    const formRef = useRef<HTMLFormElement>(null)
    const [props, setProps] = useState(old)
    const context = useIoC()
    context.define(FormPropsDispatcher, setProps)
    useEffect(() => {context.define(FormReference, () => formRef)})
    
    const children = props.children?.map((child, index) => {
        const field = props.fields?.at(index)
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
    return <form ref={formRef} className='form' action={props.action} onSubmit={onSubmit}>
        {children}
    </form>
}