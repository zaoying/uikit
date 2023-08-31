import { FC, ReactNode } from 'react';
import { Container, ContainerProps } from './container';

export type ListType = "horizontal" | "vertical"
export type ListProps = {
    type?: ListType
    children?: ReactNode[]
}

export const List: FC<ListProps> = (props) => {
    const ctnProps: ContainerProps = {
        containerClass: `list ${props.type ?? "horizontal"}`,
        children: props.children ?? []
    }
    return <Container {...ctnProps}></Container>
}