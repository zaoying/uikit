import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from "react"
import { useIoC } from "../hooks/ioc"

export type K = string | number

export interface UniqueController<T> {
    insert(item: T): void
    update(item: T): void
    remove(index: K): void
}

export type ContainerProps = {
    containerClass?: string
    itemClass?: string
    items: ItemProps[]
    children: ReactNode[]
}

export type PropsDispatcher<T> = Dispatch<SetStateAction<T>>

export const ContainerPropsDispatcher: PropsDispatcher<ContainerProps> = (cb) => {}

export function NewContainerController(setProps: PropsDispatcher<ContainerProps>): UniqueController<ItemProps> {
    return {
        insert({index, children}) {
            const item = { index: index, children: children }
            setProps(p => {
                if (p.items.find(item => item.index == index)) {
                    return p
                }
                return {...p, items: [...p.items, item]}
            })
        },
        update({index, children}) {
            const replace = (items: ItemProps[]) => {
                const item = { index: index, children: children }
                const filtered = items.filter(item => item.index != index)
                return [...filtered, item]
            }
            setProps(p => ({...p, items: replace(p.items)}))
        },
        remove(index) {
            setProps(p => ({...p, items: p.items.filter((item) => item.index != index)}))
        },
    }
}

export type ItemProps = {
    index: K
    children: ReactNode
}

export const Item: FC<ItemProps> = (props) => {
    const context = useIoC()
    const dispatcher = context.inject(ContainerPropsDispatcher)
    const ctl = NewContainerController(dispatcher)
    useEffect(()=> ctl.insert(props))
    return <></>
}

export const Container: FC<ContainerProps> = (old) => {
    const [props, setProps] = useState(old)
    const context = useIoC()
    context.define(ContainerPropsDispatcher, setProps)
    const children = props.items.length ? props.items.map(item =>
                <li key={item.index} className={props.itemClass ?? "item"}>
                    {item.children}
                </li>
            ) : props.children.map((child, index) => 
                <li key={index} className={props.itemClass ?? "item"}>
                    {child}
                </li>)
    return <ul className={props.containerClass ?? "container"}>
        { children }
    </ul>
}