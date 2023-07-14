import { useIoC } from "Com/app/hooks/ioc";
import { FC } from "react";
import { Button } from "../basic/button";

const {define, inject} = useIoC()

export const Header: FC<{title: string}> = define((props) => {
    return (
        <h3>{props.title}</h3>
    )
})

export const Body: FC = define(() => {
    return (<></>)
})

export const Footer: FC<{confirm: string, cancel: string}> = define((props) => {
    return (<div className="two buttons">
            <Button type="primary">{props.confirm}</Button>
            <Button type="grey">{props.cancel}</Button>
        </div>)
})

export const Modal: FC = define((props) => {
    const header = inject(Header, props)
    const body = inject(Body, props)
    const footer = inject(Footer, props)
    return <div className="dimmer">
        <div className="modal">
            <div className="header">{header({title: ""})}</div>
            <div className="body">{body({})}</div>
            <div className="center footer">{footer({confirm: "Confirm", cancel: "Cancel"})}</div>
        </div>
    </div>
})