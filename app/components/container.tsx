import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useId, useState } from "react"
import { useIoC } from "../hooks/ioc"
export interface Equals<T> {
    (t: T, t1: T): boolean
}

export const IDEqualizer: Equals<{id: string}> = (t1, t2) => t1.id == t2.id

export const NameEqualizer: Equals<{name: string}> = (t1, t2) => t1.name == t2.name

export const ValueEqualizer: Equals<{value: string}> = (t1, t2) => t1.value == t2.value

export type PropsDispatcher<T> = Dispatch<SetStateAction<T>>

export interface Controller<T> {
    insert(item: T): void
    update(item: T): void
    remove(item: T): void
}

export function NewController<T>(setProps: PropsDispatcher<T[]>, equals: Equals<T>): Controller<T> {
    return {
        insert(item) {
            setProps(items => {
                if (items.find(it => equals(it, item))) {
                    return items
                }
                return [...items, item]
            })
        },
        update(item) {
            setProps(items => items.map(it => equals(it, item) ? item : it))
        },
        remove(item) {
            setProps(items => items.filter(it => !equals(it, item)))
        },
    }
}

export type ContainerProps = {
    containerClass?: string
    itemClass?: string
    children: ReactNode[]
}

export interface ItemProps {
    children: ReactNode
}

interface IP extends ItemProps {
    id: string
}

export const ItemPropsDispatcher: PropsDispatcher<IP[]> = (cb) => {}

export interface ItemsController extends Controller<IP> {}

export function NewContainerController(setItems: PropsDispatcher<IP[]>): ItemsController {
    return NewController(setItems, IDEqualizer)
}

export const Item: FC<ItemProps> = (props) => {
    const context = useIoC()
    const dispatcher = context.inject(ItemPropsDispatcher)
    const ctl = NewContainerController(dispatcher)
    const id = useId()
    useEffect(()=> ctl.insert({...props, id: id}))
    return <></>
}

export const Container: FC<ContainerProps> = (props) => {
    const [items, setItems] = useState<IP[]>([])
    const context = useIoC()
    context.define(ItemPropsDispatcher, setItems)
    const itemClass = props.itemClass ?? "item"
    const containerClass = props.containerClass ?? "container"
    return <ul className={containerClass}>{
        items.length ? items.map(item => 
            <li key={item.id} className={itemClass}>
                {item.children}
            </li>)
        : props.children.map((child, index) => 
            <li key={index} className={itemClass}>
                {child}
            </li>)
    }</ul>
}