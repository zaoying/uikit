import { NewIoCContext } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useId } from 'react';

const {define} = NewIoCContext()

export type LabelProps = {
    label: ReactNode
    children: FC<{id: string}>
}

export const Label: FC<LabelProps> = define((props) => {
    const id = useId()
    return <>
        <label htmlFor={id}>{props.label}</label>
        {
            props.children({id})
        }
    </>
})