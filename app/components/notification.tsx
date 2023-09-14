import { FC, useState } from "react";
import { Context, useIoC } from "~/hooks/ioc";
import { useInterval } from "../hooks/interval";
import { PropsDispatcher } from "./container";

export interface Notifier {
    info(msg: string, timeout?: number): void
    warn(msg: string, timeout?: number): void
    error(msg: string, timeout?: number): void
    remove(expireAt: number): void
}

export type MsgType = "info" | "warn" | "error";
export type Msg = {
    type: MsgType,
    text: string
    expiredAt: number
}

function newMsg(type: MsgType, msg: string, timeout = 1000): Msg {
    const now = new Date().getTime()
    return {type: type, text: msg, expiredAt: now + timeout}
}

export type NotificationProps = {
    msgs?: Msg[],
    children: FC<{ctx: Context, ctl: Notifier}>
}

export const NotificationPropsDispatcher: PropsDispatcher<NotificationProps> = () => {}

export function NewNotifier(setProps: PropsDispatcher<NotificationProps>): Notifier {
    const add = function(msg: Msg) {
        setProps(p => ({
            ...p,
            msgs: p.msgs ? [...p.msgs, msg] : [msg]
        }))
    }
    return {
        info: function(msg: string, timeout = 5000) {
            add(newMsg("info", msg, timeout))
        },
        warn: function(msg: string, timeout = 5000) {
            add(newMsg("warn", msg, timeout))
        },
        error: function(msg: string, timeout = 5000) {
            add(newMsg("error", msg, timeout))
        },
        remove(expireAt) {
            setProps(p => ({...p, msgs: p.msgs ? p.msgs.filter(msg => msg.expiredAt != expireAt) : p.msgs}))
        },
    }
}

export const Notification: FC<NotificationProps> = (old) => {
    const [props, setProps] = useState(old)
    const context = useIoC()
    context.define(NotificationPropsDispatcher, setProps)
    useInterval(() => {
        const now = new Date().getTime()
        setProps(p => ({
            ...p, 
            msgs: p.msgs ? p.msgs.filter(msg => msg.expiredAt > now) : p.msgs
        }))
    }, 1000)
    const ctl = NewNotifier(setProps)
    
    return <>
        {props.children({ctx: context, ctl: ctl})}
        <ul className="notification">{
            props.msgs?.map(msg => (
                <li key={msg.expiredAt} className={`${msg.type} item`}>
                    <span>{msg.text}</span>
                    <a className="icon" onClick={() => ctl.remove(msg.expiredAt)}>x</a>
                </li>
            ))
        }</ul>
    </>
}