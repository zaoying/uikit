import { useIoC } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useState } from 'react';

const {define, inject} = useIoC()

export type ListType = "horizontal" | "vertical"
export type ListProps = {
    type: ListType
    children: ReactNode[]
}

export const List: FC<ListProps> = define((props) => {
    return (<ul className={`${props.type} list`}>
        {props.children.map((item, index) => <li key={index} className='item'>{item}</li>)}
    </ul>)
})

export interface ListController {
    insert(index: number, child: ReactNode): void
    replace(index: number, child: ReactNode): void
    append(...child: ReactNode[]): void
    remove(index: number): void
}

export function useList(component?: FC<ListProps>, type?: ListType): [ReactNode, ListController] {
    const list = component ?? inject(List)
    const [props, setProps] = useState<ListProps>({
        type: type ?? "vertical",
        children: []
    })
    const ctl: ListController = {
        insert(index, child) {
            setProps(p => ({...p, children: p.children.splice(index, 0, child)}))
        },
        replace(index, child) {
            setProps(p => ({...p, children: p.children.splice(index, 1, child)}))
        },
        append(child: ReactNode[]) {
            setProps(p => ({...p, children: [...p.children, ...child]}))
        },
        remove(index) {
            setProps(p => ({...p, children: p.children.filter((_, i) => i != index)}))
        },
    }
    return [list(props), ctl]
} 