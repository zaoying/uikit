import { IoCContext, NewIoCContext } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useState } from 'react';

const {define, inject} = NewIoCContext("label")

export type LabelProps = {
    label: ReactNode
    for?: string
    children?: ReactNode
}

export const SetLabelFor = define((id: string) => {})

export const Label: FC<LabelProps> = define((old) => {
    const [props, setProps] = useState(old)
    const setLabelFor = (id: string) => setProps(p => p.for == id ? p : ({...p, for: id}) )
    define(SetLabelFor, setLabelFor)
    
    return <>
        <label htmlFor={props.for}>{props.label}</label>
        <IoCContext.Provider value={{define, inject}}>
            {props.children}
        </IoCContext.Provider>
    </>
})