import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Centered, Direction, Style, centered } from '../utils/centered';

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

    const calculator = useRef<Centered>()
    useEffect(() => {
        const parent = parentRef.current
        const child = tipRef.current
        if (parent && child) {
            calculator.current = centered(parent, child)
        }
    }, [parentRef, tipRef])

    useEffect(() => {
        const result = calculator.current && calculator.current(direction)
        result && setStyle({...result, display: "none"})
    }, [direction, calculator])
    
    return <div className="tooltip" ref={parentRef}>
        {props.children}
        <div className={`tip ${direction}`} ref={tipRef} style={style}>
            {props.message}
        </div>
    </div>
}
