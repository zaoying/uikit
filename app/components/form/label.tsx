import { IoCContext, NewIoCContext, useIoC } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useId } from 'react';

const {define} = NewIoCContext()

export type LabelProps = {
    label: ReactNode
    for?: string
    children?: ReactNode
}

export const GetLabelID = define(() => "")

export const Label: FC<LabelProps> = define((props) => {
    const parent = useIoC()
    const context = NewIoCContext(parent)
    const id = useId()
    context.define(GetLabelID, () => id)
    
    return <>
        <label htmlFor={id}>{props.label}</label>
        <IoCContext.Provider value={context}>
            {props.children}
        </IoCContext.Provider>
    </>
})