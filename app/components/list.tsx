import { FC, ReactNode } from 'react';
import { useIoC as newIoC } from "../hooks/ioc";
import { Container, ContainerProps, ItemProps } from './container';

const {define} = newIoC()

export type ListType = "horizontal" | "vertical"
export type ListProps = {
    type?: ListType
    items?: ItemProps[]
    children?: ReactNode[]
}

export const List: FC<ListProps> = define((props) => {
    const ctnProps: ContainerProps = {
        containerClass: `list ${props.type ?? "horizontal"}`,
        items: props.items ?? [],
        children: props.children ?? []
    }
    return <Container {...ctnProps}></Container>
})