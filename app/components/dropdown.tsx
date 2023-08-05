import { NewIoCContext, useIoC } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useState } from 'react';

const {define, inject} = NewIoCContext()

export type Trigger = "hover" | "click"
export type DropdownProps = {
    trigger?: Trigger
    children: ReactNode
}

export const Dropdown: FC<DropdownProps> = define((props) => {
    const [collapse, setCollapse] = useState(true)
    return <div className={`dropdown ${collapse ? "collapse" : "show"}`}>
        {props.children}
    </div>
})

export interface DropdownController {

}

export function useDropdown(component?: FC<DropdownProps>, trigger?: Trigger): [ReactNode, DropdownController] {
    const context = useIoC()
    const dropdown = component ?? context.inject(Dropdown)
    const [props, setProps] = useState<DropdownProps>({
        trigger: trigger ?? "hover",
        children: <></>
    })
    const ctl: DropdownController = {}
    return [dropdown(props), ctl]
}