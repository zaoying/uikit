import { NewIoCContext } from 'Com/app/hooks/ioc';
import { FC, ReactNode } from 'react';
import { Dropdown } from './dropdown';

const {define} = NewIoCContext()

export type Trigger = "hover" | "click"
export type MenuProps = {
    trigger?: Trigger
    children: ReactNode[]
}

export const Menu: FC<MenuProps> = define((props) => {
    return <Dropdown className="menu" trigger={props.trigger}>
        {props.children}
    </Dropdown>
})