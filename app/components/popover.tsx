import { FC, MouseEventHandler, ReactNode, useState } from 'react';
import { PropsDispatcher } from './container';
import { Direction } from './tooltip';

export type Toggle = PropsDispatcher<boolean>

export type PopoverProps = {
    direction?: Direction
    content: FC<{toggle: Toggle}>
    children: ReactNode
}

export const Popover: FC<PopoverProps> = (props) => {
    const [visible, setVisible] = useState(false)
    const onClick: MouseEventHandler<HTMLDivElement> = () => setVisible(true)
    const direction = props.direction ?? "bottom"
    const className = `popover ${visible ? "show" : ""}`
    return <div className={className} onClick={onClick}>
        {props.children}
        <div className={`content ${direction}`} onClick={(e: any) => e.stopPropagation()}>
            {props.content({toggle: setVisible})}
        </div>
    </div>
}