import { FC, ReactNode, useEffect, useRef, useState } from 'react';

export type Direction = "top" | "bottom" | "left" | "right"
export type TooltipProps = {
    message?: ReactNode
    direction?: Direction
    children: ReactNode
}

export type Style = {
    top?: string,
    left?: string,
    bottom?: string, 
    right?: string
}

export const Tooltip: FC<TooltipProps> = (props) => {
    const direction = props.direction ?? "bottom"
    const [style, setStyle] = useState<Style>({})
    const parentRef = useRef<HTMLDivElement>(null)
    const tipRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const parentWidth = parentRef.current?.offsetWidth ?? 0
        const parentHeight = parentRef.current?.offsetHeight ?? 0
        const tipWidth = tipRef.current?.offsetWidth ?? 0
        const tipHeight = tipRef.current?.offsetHeight ?? 0
        const halfWidth = (parentWidth - tipWidth) / 2
        const halfHeight = (parentHeight - tipHeight) / 2
        switch(direction) {
            case "left":
                setStyle(s => ({top: halfHeight + "px", left: -tipWidth + "px"}))
                break;
            case "right":
                setStyle(s => ({top: halfHeight + "px", left: parentWidth + "px"}))
                break;
            case "top":
                setStyle(s => ({top: -tipHeight + "px", left: halfWidth + "px"}))
                break;
            default:
                setStyle(s => ({top: parentHeight + "px", left: halfWidth + "px"}))
                break;
        }
    }, [direction])
    return <div className="tooltip" ref={parentRef}>
        {props.children}
        <div className={`tip ${direction}`} ref={tipRef} style={style}>
            {props.message}
        </div>
    </div>
}
