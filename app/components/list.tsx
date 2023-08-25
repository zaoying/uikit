import { FC, ReactNode } from 'react';
import { Container, ContainerProps, ItemProps } from './container';

export type ListType = "horizontal" | "vertical"
export type ListProps = {
    type?: ListType
    items?: ItemProps[]
    children?: ReactNode[]
}

export const List: FC<ListProps> = (props) => {
    const ctnProps: ContainerProps = {
        containerClass: `list ${props.type ?? "horizontal"}`,
        items: props.items ?? [],
        children: props.children ?? []
    }
    return <Container {...ctnProps}></Container>
}