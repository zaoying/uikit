import { FC, ReactNode } from "react"
import {useIoC} from "Com/app/hooks/ioc"

const {define, inject} = useIoC()

export const ButtonChildren: FC<{label: string}> = define((props: {label: string})  => {
    return (<span>{props.label}</span>)
})

type ButtonType = "primary" | "second" | "grey"

type ButtonProps = {
    onClick?: () => void
    type?: ButtonType
    children?: ReactNode
}

export const Button: FC<ButtonProps> = define(function(props) {
    const child = inject(ButtonChildren, props);
    return (
        <a className={`${props.type ?? "primary"} button`} onClick={(e: any) => props.onClick && props.onClick()}>
            {props.children || child({label: "Click Me!"})}
        </a>
    );
})
