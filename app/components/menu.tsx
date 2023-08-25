import { FC, ReactNode } from 'react';
import { Dropdown } from './dropdown';

export type Trigger = "hover" | "click"
export type MenuProps = {
    trigger?: Trigger
    children: ReactNode[]
}

export const Menu: FC<MenuProps> = (props) => {
    return <Dropdown className="menu" trigger={props.trigger}>
        {props.children}
    </Dropdown>
}