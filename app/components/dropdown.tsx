import { NewIoCContext } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useId, useState } from 'react';

const {define} = NewIoCContext()

export type Trigger = "hover" | "click"
export type DropdownProps = {
    trigger?: Trigger
    className?: string
    visible?: boolean
    children: ReactNode[]
}

export const Dropdown: FC<DropdownProps> = define((props) => {
    const uniqueID = useId()
    const [visible, setVisible] = useState(props.visible)
    const onClick = (e: any) => {
        e.stopPropagation();
        setVisible(true)
    }
    const onPointerEnter = (e: any) => setVisible(true)
    const onPointerLeave = (e: any) => setVisible(false)
    const onBlur = (e: any) => {
        if (e.target.id == uniqueID) {
            setVisible(false)
        } else {
            setTimeout(() => setVisible(false), 250)
        }
    }
    const eventListener = props.trigger == "click" ? {onClick, onBlur} : {
        onPointerEnter,
        onPointerLeave
    }
    
    const firstChild = props.children.length >= 1 ? props.children[0] : props.children
    const onItemClick = (e: any) => {
        e.stopPropagation()
        setVisible(false)
    }
    const restChildren = props.children.filter((_, i) => i != 0)
        .map((item, i) => <li onClick={onItemClick} key={i} className="item">{item}</li>);
    
    const className = `${props.className ?? "dropdown"} ${visible ? "show" : ""}`
    return <div id={uniqueID} tabIndex={-1} className={className} {...eventListener}>
        {firstChild}
        {
            <ul className="list">
                {restChildren}
            </ul>
        }
    </div>
})
