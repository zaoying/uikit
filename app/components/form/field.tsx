import { useIoC as newIoC } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useEffect } from 'react';
import { FormPropsDispatcher, NewFormController } from './form';

const {define, inject} = newIoC("field")

export type FieldProps = {
    name: string
    children: ReactNode
}

export const Field: FC<FieldProps> = define((props) =>  {
    const setProps = inject(FormPropsDispatcher, props)
    const ctl = NewFormController(setProps)
    useEffect(() => ctl.insert(props))
    return (<></>)
})