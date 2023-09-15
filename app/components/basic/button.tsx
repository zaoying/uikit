import { FC, MouseEventHandler, ReactNode } from "react"

type ButtonType = "primary" | "second" | "grey" | "danger"

type ButtonProps = {
    onClick?: MouseEventHandler<HTMLElement>
    type?: ButtonType
    children?: ReactNode
}

export const Button: FC<ButtonProps> = function(props) {
    return (
        <button className={`${props.type ?? "primary"} button`} onClick={props.onClick}>
            {props.children}
        </button>
    );
}
