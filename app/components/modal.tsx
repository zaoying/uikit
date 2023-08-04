import { useIoC as newIoC } from "Com/app/hooks/ioc";
import { FC, ReactNode, useState } from "react";
import { Button } from "./basic/button";

const {define, inject} = newIoC()

export const Header: FC<{title?: string}> = define((props) => <h3>{props.title}</h3>)

export const Body: FC = define(() => <></>)

export const Hint = define(()=> ({
    confirm: "Confirm",
    cancel: "Cancel",
}))

export const Footer: FC<{onConfirm?: () => void, onCancel?: () => void}> = define((props) => {
    const hint = inject(Hint, props)({})
    return (<div className="two buttons">
            <Button type="primary" onClick={props.onConfirm}>{hint.confirm}</Button>
            <Button type="grey" onClick={props.onCancel}>{hint.cancel}</Button>
        </div>)
})

export type ModalProps = {
    title?: string,
    visible?: boolean
    onConfirm?: () => void
    onCancel?: () => void
}

export const Modal: FC<ModalProps> = define((props) => {
    const header = inject(Header, props)
    const body = inject(Body, props)
    const footer = inject(Footer, props)
    return <div className={`dimmer ${props.visible ? "show" : ""}`}>
        <div className="modal">
            <div className="header">{header(props)}</div>
            <div className="body">{body(props)}</div>
            <div className="center footer">
                {footer(props)}
            </div>
        </div>
    </div>
})

export interface ModalController {
    title(text: string): void
    open(): void
    close(): void
    onConfirm(cb: () => void): void
    onCancel(cb: () => void): void
}

export function useModal(component?: FC<ModalProps>): [ReactNode, ModalController] {
    const modal = component ?? inject(Modal)
    const [props, setProps] = useState<ModalProps>({})
    const toggle = function(visible: boolean) {
        setProps(p =>  ({...p, visible: visible}))
    }
    const ctl: ModalController = {
        title: (text) => setProps(p => ({...p, title: text})),
        open: () => toggle(true),
        close: () => toggle(false),
        onConfirm: (cb) => setProps(p => ({...p, onConfirm: cb})),
        onCancel: (cb) => setProps(p => ({...p, onCancel: cb}))
    }
    return [modal(props), ctl]
}