import { useIoC } from "Com/app/hooks/ioc";
import { FC, ReactNode, useState } from "react";
import { Context } from "vm";
import { i18n, useI18n } from "../hooks/i18n";
import { Button } from "./basic/button";
import { PropsDispatcher } from "./container";
import { Once } from "./once";

export const ModalDict = i18n("en-us", () => {
    return {
        confirm: "Confirm",
        cancel: "Cancel"
    }
})

export const Header: FC<{title?: ReactNode}> = (props) => {
    const title = typeof props.title == "string" ? <p className="title">{props.title}</p> : props.title
    return title
}

export const Body: FC = () => <></>

export type FooterProps = {
    confirm?: ReactNode
    cancel?: ReactNode
    onConfirm?: () => boolean,
    onCancel?: () => boolean
}

export const Footer: FC<FooterProps> = (props) => {
    const context = useIoC()    
    const setProps = context.inject(ModalPropsDispatcher)
    const ctl = NewModalController(setProps)
    const onConfirm = () => (props.onConfirm && props.onConfirm()) || ctl.close()
    const onCancel = () => (props.onCancel && props.onCancel()) || ctl.close()
    const dict = useI18n(ModalDict)({})
    const confirm = <Button type="primary" onClick={onConfirm}>{dict.confirm}</Button>
    const cancel = <Button type="grey" onClick={onCancel}>{dict.cancel}</Button>
    return <div className="two buttons">
        {props.confirm ?? confirm}
        {props.cancel ?? cancel}
    </div>
}

export type ModalProps = {
    title?: ReactNode,
    visible?: boolean
    width?: number
    height?: number
    className?: string
    confirm?: ReactNode
    cancel?: ReactNode
    children?: FC<{ctx: Context, ctl: ModalController}>
}

export const ModalPropsDispatcher: PropsDispatcher<ModalProps> = (cb) => {}

export interface ModalController {
    title(text: ReactNode): void
    onConfirm(callback?: () => boolean): void
    onCancel(callback?: () => boolean): void
    title(text: ReactNode): void
    open(): void
    close(): void
}

export function NewModalController(setProps: PropsDispatcher<ModalProps>): ModalController {
    const toggle = function(visible: boolean) {
        setProps(p => p.visible == visible ? p : {...p, visible: visible})
    }
    return {
        title(title: ReactNode) {
            setProps(p => ({...p, title: title}))
        },
        onConfirm(callback) {
            setProps(p => ({...p, onConfirm: callback}))
        },
        onCancel(callback) {
            setProps(p => ({...p, onCancel: callback}))
        },
        open: () => toggle(true),
        close: () => toggle(false)
    }
}

export const Modal: FC<ModalProps> = (old) => {
    const [props, setProps] = useState<ModalProps>(old)
    const context = useIoC()
    context.define(ModalPropsDispatcher, setProps)

    const className = props.className ?? "modal"
    return <>
        <Once>{
            () => props.children && props.children({
                ctx: context,
                ctl: NewModalController(setProps)
            })
        }</Once>
        <div className={`dimmer ${props.visible ? "show" : ""}`}>
        <div className={className} style={{width: props.width, height: props.height}}>
                <div className="header">{context.inject(Header)(props)}</div>
                <div className="body">
                    {context.inject(Body)(props)}
                </div>
                <div className="center footer">
                    {context.inject(Footer)(props)}
                </div>
        </div>
    </div>
    </>
}