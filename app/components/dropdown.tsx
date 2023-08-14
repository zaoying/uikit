import { NewIoCContext } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useState } from 'react';

const {define} = NewIoCContext()

export type Trigger = "hover" | "click"
export type DropdownProps = {
    trigger?: Trigger
    children: ReactNode[]
}

export const Dropdown: FC<DropdownProps> = define((props) => {
    const [visible, setVisible] = useState(false)
    const onClick = (e: any) => setVisible(flag => !flag)
    const onPointerEnter = (e: any) => setVisible(true)
    const onPointerLeave = (e: any) => setVisible(false)
    const eventListener = props.trigger == "click" ? {onClick} : {
        onClick,
        onPointerEnter,
        onPointerLeave
    }
    
    const firstChild = props.children.length >= 1 ? props.children[0] : props.children
    const onItemClick = (e: any) => {
        e.stopPropagation()
        setVisible(false)
    }
    const restChildren = props.children.filter((_, i) => i != 0)
        .map((item, i) => <li onClick={onItemClick} key={i} className="item">{item}</li>)
    return <div className={`dropdown ${visible ? "show" : ""}`} {...eventListener}>
        {firstChild}
        {
            visible && <ul className="list">
                {restChildren}
            </ul>
        }
    </div>
})
