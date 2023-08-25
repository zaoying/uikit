import { FC, ReactNode, useState } from 'react';

export type Trigger = "hover" | "click"
export type Direction = "top" | "bottom" | "left" | "right"
export type TooltipProps = {
    trigger?: Trigger
    message?: ReactNode
    direction?: Direction
    children: ReactNode
}

export const Tooltip: FC<TooltipProps> = (props) => {
    const [visible, setVisible] = useState(props.trigger != "click")
    const onClick = (e: any) => setVisible(true)
    return <div className="tooltip" onClick={onClick}>
        {props.children}
        {visible && <span className={`tip ${props.direction}`}>{props.message}</span>}
    </div>
}
