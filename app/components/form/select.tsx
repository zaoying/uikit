import { NewIoCContext, useIoC } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useEffect, useState } from 'react';
import { PropsDispatcher, UniqueController } from '../container';
import { Dropdown } from '../dropdown';

const {define} = NewIoCContext()

export type SelectItemProps<T> = {
    name: string
    value: T
}

export type SelectProps = {
    id: string
    name: string
    value?: string
    options?: SelectItemProps<any>[]
    filterFunc?: (op: SelectItemProps<any>) => boolean
    children?: ReactNode
}

export const SelectPropsDispatcher: PropsDispatcher<SelectProps> = define((cb) => {})

export interface SelectController extends UniqueController<SelectItemProps<any>> {
}

export function NewSelectController(setProps: PropsDispatcher<SelectProps>):SelectController  {
    return {
        insert(op) {
            setProps(p => {
                if (!p.options) {
                    return {...p, options: [op]}
                }
                if (p.options.find(o => o.name == op.name)) {
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
                const options = p.options.map(o => o.name == op.name ? op : o)
                return {...p, options: options}
            })
        },
        remove(name) {
            setProps(p => {
                if (!p.options) {
                    return p
                }
                const options = p.options.filter(o => o.name != name)
                return {...p, options: options}
            })
        }
    }
}

export const SelectItem: FC<SelectItemProps<any>> = define((props) => {
    const context = useIoC()
    const setProps = context.inject(SelectPropsDispatcher)
    const ctl = NewSelectController(setProps)
    useEffect(() => ctl.insert(props))
    return <></>
})

export const Select: FC<SelectProps> = define((old) => {
    const context = useIoC()
    const [props, setProps] = useState(old)
    context.define(SelectPropsDispatcher, setProps)

    const [selected, setSelected] = useState(old.value)
    
    const [value, setValue] = useState(old.value)
    const onChange = (e: any) => {
        const val = e.target.value
        if (val instanceof File) {
            return setValue(val.name)
        }
        setValue(val ? `${val}` : "")
    }

    const defaultFilterFunc = function(op: SelectItemProps<any>) {
        return value ? op.name.startsWith(value) : true
    }
    const filterFunc = props.filterFunc ?? defaultFilterFunc
    
    const select = <div key={props.id} className="select">
        <input id={props.id} name={props.name} defaultValue={selected} onChange={onChange}/>
        <i className="icon">﹀</i>
    </div>
    const options = props.options?.filter(filterFunc).map((op, i) => (
        <a key={op.value} className="button" onClick={() => setSelected(op.name)}>
            {op.name}
        </a>
    ))
    return <>
        {props.children}
        <Dropdown trigger="click">
            {options ? [select, ...options] : [select]}
        </Dropdown>
    </>
})