import { FC, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Context, useIoC } from "~/hooks/ioc";
import { useInterval } from "../hooks/interval";
import { PropsDispatcher } from "./container";

export interface Notifier {
    info(msg: string, timeout?: number): void
    warn(msg: string, timeout?: number): void
    error(msg: string, timeout?: number): void
    remove(id: string): void
}

export type MsgType = "info" | "warn" | "error";
export type Msg = {
    id: string
    type: MsgType,
    text: string
    expiredAt: number
}

function newMsg(type: MsgType, msg: string, timeout = 1000): Msg {
    const now = new Date().getTime()
    return {id: uuidv4(), type: type, text: msg, expiredAt: now + timeout}
}

export type NotificationProps = {
    children: FC<{ctx: Context, ctl: Notifier}>
}

export const NotificationPropsDispatcher: PropsDispatcher<Msg[]> = () => {}

export function NewNotifier(setProps: PropsDispatcher<Msg[]>): Notifier {
    const add = function(msg: Msg) {
        setProps(msgs => msgs ? [...msgs, msg] : [msg])
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
        remove(id) {
            setProps(msgs => msgs ? msgs.filter(msg => msg.id != id) : msgs)
        },
    }
}

export const Notification: FC<NotificationProps> = (props) => {
    const [msgs, setMsgs] = useState<Msg[]>([])
    const context = useIoC()
    context.define(NotificationPropsDispatcher, setMsgs)
    useInterval(() => {
        const now = new Date().getTime()
        setMsgs(list => {
            if (list.length == 0) {
                return list
            }
            let index = list.findIndex(msg => msg.expiredAt <= now)
            if (index >= 0) {
                return list.filter(msg => msg.expiredAt > now)
            }
            return list
        })
    }, 1000)
    const ctl = NewNotifier(setMsgs)
    
    return <>
        {props.children({ctx: context, ctl: ctl})}
        <ul className="notification">{
            msgs.map(msg => <li key={msg.id} className={`${msg.type} item`}>
                <i className={`icon iconfont icon-info-fill`}></i>
                <span className="text">{msg.text}</span>
                <i className="action iconfont icon-cross tiny" onClick={() => ctl.remove(msg.id)}></i>
            </li>
            )
        }</ul>
    </>
}