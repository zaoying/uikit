import { FC, ReactNode, useState } from "react"
import { useIoC as newIoC } from "../hooks/ioc"

const {define, inject} = newIoC()

export type K = string | number

export interface UniqueController {
    get(key: K): ReactNode
    insert(key: K, child: ReactNode): void
    update(key: K, child: ReactNode): void
    remove(key: K): void
}

export type ContainerProps = {
    containerClass?: string
    itemClass?: string
    items: ItemProps[]
    children: ReactNode[]
}

export function NewUniqueController<T>(props: ContainerProps): UniqueController {
    const [oldProps, setProps] = useState(props)
    return {
        get(key) {
            return oldProps.items.find((item) => item.key == key)?.children
        },
        insert(index, child) {
            const item = { key: index, children: child }
            setProps(p => ({...p, items: [...p.items, item]}))
        },
        update(index, child) {
            const replace = (items: ItemProps[]) => {
                const item = { key: index, children: child }
                const filtered = items.filter(item => item.key != index)
                return [...filtered, item]
            }
            setProps(p => ({...p, items: replace(p.items)}))
        },
        remove(index) {
            setProps(p => ({...p, items: p.items.filter((item) => item.key != index)}))
        },
    }
}

export type ItemProps = {
    key: K
    children: ReactNode
}

export const ItemController: (props: ItemProps) => UniqueController = define((props) => {
    return {
        get(key) { return null },
        insert(key, child) {},
        update(key, child) {},
        remove(key) {}
    }
})

export const Item: FC<ItemProps> = define((props) => {
    const ctl = inject(ItemController, props)(props)
    ctl.insert(props.key, props.children)
    return <></>
})

export const Container: FC<ContainerProps> = define((props) => {
    define(ItemController, () => NewUniqueController(props))
    const children = props.items.length ? props.items.map(item =>
                <li key={item.key} className={props.itemClass ?? "item"}>
                    {item.children}
                </li>
            ) : props.children.map((child, index) => 
                <li key={index} className={props.itemClass ?? "item"}>
                    {child}
                </li>)
    return <ul className={props.containerClass ?? "container"}>
        { children }
    </ul>
})