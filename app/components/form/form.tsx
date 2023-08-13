import { NewIoCContext, useIoC } from 'Com/app/hooks/ioc';
import { FC, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { PropsDispatcher, UniqueController } from '../container';

const {define} = NewIoCContext()

export type InputType = string | ReadonlyArray<string> | number | undefined

export type FieldProps = {
    name: string
    validate: (val: InputType) => string | undefined
    errorMsg?: string
}

export type FormProps = {
    action?: string
    onSubmit?: (props: FormProps) => boolean
    fields?: FieldProps[]
    children?: ReactNode[]
}

export interface FormController extends UniqueController<FieldProps> {
    submit(): void
    validate(formRef: RefObject<HTMLFormElement>): void
    reset(): void
}

export const FormPropsDispatcher: PropsDispatcher<FormProps> = define((cb) => {})

export const FormRefrence: ({}) => RefObject<HTMLFormElement> = define(()=>useRef<HTMLFormElement>(null))

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
                const shouldSubmit = p.onSubmit && p.onSubmit(p); 
                return {...p, shouldSubmit}
            })
        },
        validate(formRef) {
            if (formRef.current) {
                const formData = new FormData(formRef.current)
                formData.forEach((val, name) => {
                    if (val instanceof File) {
                        return
                    }
                    setProps(p => {
                        if (!p.fields) {
                            return p
                        }
                        const fields = p.fields.map(field => {
                            if (field.name != name) {
                                return field
                            }
                            const errMsg = field.validate(val)
                            return {...field, errorMsg: errMsg}
                        })
                        return {...p, fields: [...fields]}
                    })
                })
            }
        },
        reset: () => setProps(p => ({...p, fields: []}))
    }
}

export const Form: FC<FormProps> = define((old) => {
    const formRef = useRef<HTMLFormElement>(null)
    const [props, setProps] = useState(old)
    const context = useIoC()
    context.define(FormPropsDispatcher, setProps)
    useEffect(() => {context.define(FormRefrence, () => formRef)})
    
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
        const formData = new FormData(e.target);
        console.info(formData)
        return props.onSubmit && props.onSubmit(props)
    }
    return <form ref={formRef} className='form' action={props.action} onSubmit={onSubmit}>
        {children}
    </form>
})