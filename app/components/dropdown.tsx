import { NewIoCContext, useIoC } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useState } from 'react';

const {define} = NewIoCContext()

export type Trigger = "hover" | "click"
export type DropdownProps = {
    trigger?: Trigger
    children: ReactNode
}

export const Toggle = define((flag: boolean)=> {})

export const Dropdown: FC<DropdownProps> = define((props) => {
    const context = useIoC()
    const [collapse, setCollapse] = useState(true)
    context.define(Toggle, setCollapse)
    return <div className={`dropdown ${collapse ? "collapse" : "show"}`}>
        {props.children}
    </div>
})

export interface DropdownController {
    toggle(flag: boolean): void
}

export function NewDropdownController(toggle: (flag: boolean) => void): DropdownController {
    return {
        toggle
    }
}