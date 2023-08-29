import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Direction, Style, centered } from '../utils/centered';

export type TooltipProps = {
    message?: ReactNode
    direction?: Direction
    children: ReactNode
}

export const Tooltip: FC<TooltipProps> = (props) => {
    const direction = props.direction ?? "bottom"
    const [style, setStyle] = useState<Style>({})
    const parentRef = useRef<HTMLDivElement>(null)
    const tipRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const parent = parentRef.current
        const child = tipRef.current
        if (parent && child) {
            const center = centered(parent, child, direction)
            center.display = "none"
            setStyle(center)
        }
    }, [direction])
    return <div className="tooltip" ref={parentRef}>
        {props.children}
        <div className={`tip ${direction}`} ref={tipRef} style={style}>
            {props.message}
        </div>
    </div>
}
