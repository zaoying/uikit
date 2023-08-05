import { NewIoCContext, useIoC } from "Com/app/hooks/ioc";
import { FC, useState } from "react";
import { Button } from "./basic/button";
import { PropsDispatcher } from "./container";

const {define} = NewIoCContext("Modal")

export const Header: FC<{title?: string}> = define((props) => <h3>{props.title}</h3>)

export const Body: FC = define(() => <></>)

export const Hint = define(()=> ({
    confirm: "Confirm",
    cancel: "Cancel"
}))

export type FooterProps = {
    onConfirm?: () => boolean,
    onCancel?: () => boolean
}

export const Footer: FC<FooterProps> = define((props) => {
    const context = useIoC()
    const hint = context.inject(Hint, props)({})
    
    const setProps = context.inject(ModalPropsDispatcher)
    const ctl = NewModalController(setProps)
    const onConfirm = () => (props.onConfirm && props.onConfirm()) || ctl.close()
    const onCancel = () => (props.onCancel && props.onCancel()) || ctl.close()
    return (<div className="two buttons">
            <Button type="primary" onClick={onConfirm}>{hint.confirm}</Button>
            <Button type="grey" onClick={onCancel}>{hint.cancel}</Button>
        </div>)
})

export type ModalProps = {
    title?: string,
    visible?: boolean
    width?: number
    height?: number
    onConfirm?: () => boolean
    onCancel?: () => boolean
}

export const ModalPropsDispatcher: PropsDispatcher<ModalProps> = define((cb) => {})

export interface ModalController {
    title(text: string): void
    open(): void
    close(): void
    onConfirm(cb: () => boolean): void
    onCancel(cb: () => boolean): void
}

export function NewModalController(setProps: PropsDispatcher<ModalProps>): ModalController {
    const toggle = function(visible: boolean) {
        setProps(p =>  ({...p, visible: visible}))
    }
    return {
        title: (text) => setProps(p => ({...p, title: text})),
        open: () => toggle(true),
        close: () => toggle(false),
        onConfirm: (cb) => setProps(p => ({...p, onConfirm: cb})),
        onCancel: (cb) => setProps(p => ({...p, onCancel: cb}))
    }
}

export const Modal: FC<ModalProps> = define((old) => {
    const [props, setProps] = useState<ModalProps>(old)
    const parent = useIoC()

    parent.define(ModalPropsDispatcher, setProps)
    const header = parent.inject(Header)
    const body = parent.inject(Body)
    const footer = parent.inject(Footer)
    return <div className={`dimmer ${props.visible ? "show" : ""}`}>
        <div className="modal" style={{width: props.width, height: props.height}}>
                <div className="header">{header(props)}</div>
                <div className="body">{body(props)}</div>
                <div className="center footer">
                    {footer(props)}
                </div>
        </div>
    </div>
})