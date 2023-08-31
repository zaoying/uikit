import { useIoC } from 'Com/app/hooks/ioc';
import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { Controller, NewController, PropsDispatcher, ValueEqualizer } from '../container';
import { Dropdown } from '../dropdown';

export type SelectItemProps = {
    value: string
    children: string
}

export type SelectProps = {
    id: string
    name: string
    value?: string
    filterFunc?: (op: SelectItemProps) => boolean
    children?: ReactNode
}

interface SP extends SelectProps {
    id: string
    name: string
    value?: string
    options: SelectItemProps[]
}

export const SelectPropsDispatcher: PropsDispatcher<SP> = (cb) => {}

export interface SelectController extends Controller<SelectItemProps> {}

export function NewSelectController(setProps: PropsDispatcher<SP>): SelectController {
    const setOptions: PropsDispatcher<SelectItemProps[]> = (action) => setProps(p => {
        const options = (typeof action == "function") ? action(p.options) : action
        return {...p, options: options}
    })
    return NewController<SelectItemProps>(setOptions, ValueEqualizer)
}

export const SelectItem: FC<SelectItemProps> = (props) => {
    const context = useIoC()
    const setProps = context.inject(SelectPropsDispatcher)
    const ctl = NewSelectController(setProps)
    useEffect(() => ctl.insert(props))
    return <></>
}

export const Select: FC<SelectProps> = (old) => {
    const context = useIoC()
    const [props, setProps] = useState<SP>({...old, options: []})
    context.define(SelectPropsDispatcher, setProps)
    
    const [value, setValue] = useState(old.value ?? "")
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const defaultFilterFunc = function(op: SelectItemProps) {
        return value ? op.children.startsWith(value) : true
    }
    const filterFunc = props.filterFunc ?? defaultFilterFunc
    
    const select = <div key={props.id} className="header">
        <input id={props.id} name={props.name} value={value} onChange={onChange}/>
        <i className="right icon">﹀</i>
    </div>
    
    const options = props.options.filter(filterFunc).map((op) => (
        <a key={op.value} className="button" onClick={() => setValue(op.children)}>
            {op.children}
        </a>
    ))
    return <>
        {props.children}
        <Dropdown className="select" trigger="click">
            {[select, ...options]}
        </Dropdown>
    </>
}