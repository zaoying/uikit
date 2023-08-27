import { FC, MouseEventHandler, ReactNode } from "react"

type ButtonType = "primary" | "second" | "grey" | "danger"

type ButtonProps = {
    onClick?: MouseEventHandler<HTMLAnchorElement>
    type?: ButtonType
    children?: ReactNode
}

export const Button: FC<ButtonProps> = function(props) {
    return (
        <a className={`${props.type ?? "primary"} button`} onClick={props.onClick}>
            {props.children}
        </a>
    );
}
