import { NewIoCContext, useIoC } from "Com/app/hooks/ioc";
import { FC, ReactNode, useState } from "react";
import { Context } from "vm";
import { i18n, useI18n } from "../hooks/i18n";
import { Button } from "./basic/button";
import { PropsDispatcher } from "./container";
import { Once } from "./once";

const {define} = NewIoCContext()

export const ModalDict = i18n("en-us", () => {
    return {
        confirm: "Confirm",
        cancel: "Cancel"
    }
})

export const Header: FC<{title?: ReactNode}> = define((props) => {
    const title = typeof props.title == "string" ? <p className="title">{props.title}</p> : props.title
    return title
})

export const Body: FC = define(() => <></>)

export type FooterProps = {
    confirm?: ReactNode
    cancel?: ReactNode
    onConfirm?: () => boolean,
    onCancel?: () => boolean
}

export const Footer: FC<FooterProps> = define((props) => {
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
})

export type ModalProps = {
    title?: ReactNode,
    visible?: boolean
    width?: number
    height?: number
    confirm?: ReactNode
    cancel?: ReactNode
    children?: FC<{ctl: ModalController, ctx: Context}>
}

export const ModalPropsDispatcher: PropsDispatcher<ModalProps> = define((cb) => {})

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

export const Modal: FC<ModalProps> = define((old) => {
    const [props, setProps] = useState<ModalProps>(old)
    const parent = useIoC()

    parent.define(ModalPropsDispatcher, setProps)
    return <>
        <Once>
            {
                () => props.children && props.children({
                    ctl: NewModalController(setProps),
                    ctx: parent
                })}
        </Once>
        <div className={`dimmer ${props.visible ? "show" : ""}`}>
        <div className="modal" style={{width: props.width, height: props.height}}>
                <div className="header">{parent.inject(Header)(props)}</div>
                <div className="body">
                    {parent.inject(Body)(props)}
                </div>
                <div className="center footer">
                    {parent.inject(Footer)(props)}
                </div>
        </div>
    </div>
    </>
})