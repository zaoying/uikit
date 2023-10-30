import { FC, MouseEventHandler, ReactNode } from "react"

type ButtonType = "primary" | "second" | "grey" | "danger"

type ButtonProps = {
    title?: string
    onClick?: MouseEventHandler<HTMLElement>
    type?: ButtonType
    disabled?: boolean
    children?: ReactNode
}

export const Button: FC<ButtonProps> = function(props) {
    const className = `${props.type ?? "primary"} button`
    
    return (
        <button type="button" title={props.title} className={className}
            disabled={props.disabled} onClick={props.onClick}>
            {props.children}
        </button>
    );
}
