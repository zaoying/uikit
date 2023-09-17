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

interface SP {
    options: SelectItemProps[]
}

export const SelectPropsDispatcher: PropsDispatcher<SP> = (cb) => {}

export interface SelectController extends Controller<SelectItemProps> {
    updateOrInsert(option: SelectItemProps): void
}

export function NewSelectController(setProps: PropsDispatcher<SP>): SelectController {
    const setOptions: PropsDispatcher<SelectItemProps[]> = (action) => setProps(p => {
        const options = (typeof action == "function") ? action(p.options) : action
        return {...p, options: options}
    })
    const ctl = NewController<SelectItemProps>(setOptions, ValueEqualizer)
    return {
        ...ctl,
        updateOrInsert(option) {
            setProps(p => {
                const index = p.options.findIndex(op => op.value == option.value)
                if (index >= 0) {
                    p.options[index] = option
                    return {...p, options: [...p.options]}
                } 
                return {...p, options: [...p.options, option]}
            })
        },
    }
}

export const SelectItem: FC<SelectItemProps> = (props) => {
    const context = useIoC()
    const setProps = context.inject(SelectPropsDispatcher)
    const ctl = NewSelectController(setProps)
    useEffect(() => ctl.updateOrInsert(props))
    return <></>
}

export const Select: FC<SelectProps> = (old) => {
    const context = useIoC()
    const [props, setProps] = useState<SP>({options: []})
    context.define(SelectPropsDispatcher, setProps)
    
    const [label, setLabel] = useState(old.label ?? "")
    useEffect(() => setLabel(old.label ?? ""), [old])
    const [value, setValue] = useState(old.value ?? "")
    useEffect(() => setValue(old.value ?? ""), [old])
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value)
    }

    const defaultFilterFunc = function(op: SelectItemProps) {
        return label ? op.children.startsWith(label) : true
    }
    const filterFunc = old.filterFunc ?? defaultFilterFunc
    
    const select = <div key={old.id} className="header">
        <input name={old.name} value={value} type="hidden"/>
        <input id={old.id} value={label} onChange={onChange}/>
        <i className="icon iconfont icon-arrow-down small right"></i>
    </div>
    
    const options = props.options.filter(filterFunc).map((op) => (
        <a key={op.value} onClick={() => {setValue(op.value); setLabel(op.children)}}>
            {op.children}
        </a>
    ))
    return <>
        {old.children}
        <Dropdown className="select" trigger="click">
            {[select, ...options]}
        </Dropdown>
    </>
}