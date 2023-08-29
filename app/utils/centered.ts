export type Direction = "top" | "bottom" | "left" | "right"

export type Style = {
    top?: string,
    left?: string,
    bottom?: string, 
    right?: string
    display?: string
}

export function centered(parent: HTMLElement, child: HTMLElement, direction: Direction): Style {
    const parentWidth = parent.offsetWidth ?? 0
    const parentHeight = parent.offsetHeight ?? 0
    const tipWidth = child.offsetWidth ?? 0
    const tipHeight = child.offsetHeight ?? 0
    const halfWidth = (parentWidth - tipWidth) / 2
    const halfHeight = (parentHeight - tipHeight) / 2
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