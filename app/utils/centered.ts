
export type Direction = "top" | "bottom" | "left" | "right"

export type Style = {
    top?: string,
    left?: string,
    bottom?: string, 
    right?: string
    display?: string
}

export type Centered = (direction: Direction) => Style

export function centered(parent: HTMLElement, child: HTMLElement): Centered {
    const parentWidth = parent.offsetWidth
    const parentHeight = parent.offsetHeight
    const tipWidth = child.offsetWidth
    const tipHeight = child.offsetHeight
    const halfWidth = (parentWidth - tipWidth) / 2
    const halfHeight = (parentHeight - tipHeight) / 2
    return (direction: Direction) => {
            switch(direction) {
            case "left":
                return {top: halfHeight + "px", left: -tipWidth + "px"}
            case "right":
                return {top: halfHeight + "px", left: parentWidth + "px"}
            case "top":
                return {top: -tipHeight + "px", left: halfWidth + "px"}
            default:
                return {top: parentHeight + "px", left: halfWidth + "px"}
        }
    }
}