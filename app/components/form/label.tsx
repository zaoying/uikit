import { FC, ReactNode, useId } from 'react';

export type LabelProps = {
    label: ReactNode
    children: FC<{id: string}>
}

export const Label: FC<LabelProps> = (props) => {
    const id = useId()
    return <>
        <label htmlFor={id}>{props.label}</label>
        {
            props.children({id})
        }
    </>
}