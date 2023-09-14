import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useIoC } from '~/hooks/ioc';
import { Controller, NewController, PropsDispatcher, ValueEqualizer } from '../container';
import { Dropdown } from '../dropdown';

export type SelectItemProps = {
    value: string
    children: string
}

export type SelectProps = {
    id: string
    name: string
    label?: string
    value?: string
    filterFunc?: (op: SelectItemProps) => boolean
    children?: ReactNode
}

interface SP extends SelectProps {
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
    
    const [label, setLabel] = useState(old.label ?? "")
    const [value, setValue] = useState(old.value ?? "")
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value)
    }

    const defaultFilterFunc = function(op: SelectItemProps) {
        return label ? op.children.startsWith(label) : true
    }
    const filterFunc = props.filterFunc ?? defaultFilterFunc
    
    const select = <div key={props.id} className="header">
        <input name={props.name} value={value} readOnly style={{display: "none"}}/>
        <input id={props.id} value={label} onChange={onChange}/>
        <i className="icon iconfont icon-arrow-down small right"></i>
    </div>
    
    const options = props.options.filter(filterFunc).map((op) => (
        <a key={op.value} className="button" onClick={() => {setValue(op.value); setLabel(op.children)}}>
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