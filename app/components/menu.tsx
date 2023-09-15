import { FC, ReactNode } from 'react';
import { Direction } from '~/utils/centered';
import { Dropdown } from './dropdown';

export type Trigger = "hover" | "click"
export type MenuProps = {
    trigger?: Trigger
    direction?: Direction
    children: ReactNode[]
}

export const Menu: FC<MenuProps> = (props) => {
    const className = `menu ${props.direction ?? "left"}`
    return <Dropdown className={className} trigger={props.trigger}>
        {props.children}
    </Dropdown>
}