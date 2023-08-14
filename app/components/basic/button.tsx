import { NewIoCContext } from "Com/app/hooks/ioc"
import { FC, ReactNode } from "react"

const {define} = NewIoCContext()
type ButtonType = "primary" | "second" | "grey" | "danger"

type ButtonProps = {
    onClick?: () => void
    type?: ButtonType
    children?: ReactNode
}

export const Button: FC<ButtonProps> = define(function(props) {
    return (
        <a className={`${props.type ?? "primary"} button`} onClick={props.onClick}>
            {props.children}
        </a>
    );
})
