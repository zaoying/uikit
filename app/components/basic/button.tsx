import { FC, ReactNode } from "react"
import {useIoC} from "Com/app/hooks/ioc"

const {define} = useIoC()
type ButtonType = "primary" | "second" | "grey"

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
