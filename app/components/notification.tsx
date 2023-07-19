import { useIoC } from "Com/app/hooks/ioc";
import { FC, ReactNode, useState } from "react";
import { useInterval } from "../hooks/interval";

const {define, inject} = useIoC()

export interface Notifier {
    info(msg: string, timeout?: number): void
    warn(msg: string, timeout?: number): void
    error(msg: string, timeout?: number): void
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
    msgs: Msg[],
    remove: (id: number) => void
}

export const Notification: FC<NotificationProps> = define((props) => {
    return <ul className="notification">
        {
            props.msgs.map(msg => (
                <li key={msg.expiredAt} className={`${msg.type} item`}>
                    <span>{msg.text}</span>
                    <a className="icon" onClick={() => props.remove(msg.expiredAt)}>x</a>
                </li>
            ))
        }
    </ul>
})

export function useNotification(component?: FC<NotificationProps>): [ReactNode, Notifier] {
    const notification = component ?? inject(Notification)
    const [msgs, list] = useState(new Array<Msg>())
    useInterval(() => {
        const now = new Date().getTime()
        list(old => old.length ? old.filter(msg => msg.expiredAt > now) : old)
    }, 1000)
    
    const remove = function(id: number) {
        list(old => old.filter(msg => msg.expiredAt != id))
    }

    const notifier: Notifier = {
        info: function(msg: string, timeout = 5000) {
            list((old)=> [...old, newMsg("info", msg, timeout)])
        },
        warn: function(msg: string, timeout = 5000) {
            list((old)=> [...old, newMsg("warn", msg, timeout)])
        },
        error: function(msg: string, timeout = 5000) {
            list((old)=> [...old, newMsg("error", msg, timeout)])
        }
    }
    return [notification({msgs: msgs, remove: remove}), notifier]
}