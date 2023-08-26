import { useIoC } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useEffect, useState } from 'react';
import { PropsDispatcher, UniqueController } from '../container';
import { Dropdown } from '../dropdown';

export type SelectItemProps = {
    value: string
    children: string
}

export type SelectProps = {
    id: string
    name: string
    value?: string
    options?: SelectItemProps[]
    filterFunc?: (op: SelectItemProps) => boolean
    children?: ReactNode
}

export const SelectPropsDispatcher: PropsDispatcher<SelectProps> = (cb) => {}

export interface SelectController extends UniqueController<SelectItemProps> {
}

export function NewSelectController(setProps: PropsDispatcher<SelectProps>):SelectController  {
    return {
        insert(op) {
            setProps(p => {
                if (!p.options) {
                    return {...p, options: [op]}
                }
                if (p.options.find(o => o.value == op.value)) {
                    return p
                }
                return {...p, options: [...p.options, op]}
            })
        },
        update(op) {
            setProps(p => {
                if (!p.options) {
                    return p
                }
                const options = p.options.map(o => o.value == op.value ? op : o)
                return {...p, options: options}
            })
        },
        remove(val) {
            setProps(p => {
                if (!p.options) {
                    return p
                }
                const options = p.options.filter(o => o.value != val)
                return {...p, options: options}
            })
        }
    }
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
    const [props, setProps] = useState(old)
    context.define(SelectPropsDispatcher, setProps)

    const [selected, setSelected] = useState<SelectItemProps>({value: "", children: ""})
    
    const [value, setValue] = useState(old.value)
    const onChange = (e: any) => {
        const val = e.target.value
        if (val instanceof File) {
            return setValue(val.name)
        }
        setValue(val ? `${val}` : "")
    }

    const defaultFilterFunc = function(op: SelectItemProps) {
        return value ? op.children.startsWith(value) : true
    }
    const filterFunc = props.filterFunc ?? defaultFilterFunc
    
    const select = <div key={props.id} className="header">
        <input id={props.id} name={props.name} defaultValue={selected.children} onChange={onChange}/>
        <i className="right icon">﹀</i>
    </div>
    const onClick = (op: SelectItemProps) => {
        setValue(op.children)
        setSelected(op)
    }
    const options = props.options?.filter(filterFunc).map((op) => (
        <a key={op.value} className="button" onClick={() => onClick(op)}>
            {op.children}
        </a>
    ))
    return <>
        {props.children}
        <Dropdown className="select" trigger="click">
            {options ? [select, ...options] : [select]}
        </Dropdown>
    </>
}