import { FC, ReactNode, useRef } from "react"
import { IoCContext, NewIoCContext, useIoC } from "../hooks/ioc"
import { Body, Header, Modal } from "./modal"

export type DialogProps = {
    title: ReactNode
    content: ReactNode
    onConfirm?: () => void
    onCancel?: () => void
    children: ReactNode
}

export const Dialog: FC<DialogProps> = (props) => {
    const parent = useIoC()
    const context = NewIoCContext(parent)
    context.define(Header, () => <p className="title">{props.title}</p>)
    context.define(Body, () => <>{props.content}</>)
    
    const onConfirm = () => {props.onConfirm && props.onConfirm(); return false;}
    const onCancel = () => {props.onCancel && props.onCancel(); return false;}
    const open = useRef(() => {})
    return <IoCContext.Provider value={context}>
        <Modal className="dialog" width={240} >{
            ({ctl}) => {
                ctl.onConfirm(onConfirm)
                ctl.onCancel(onCancel)
                open.current = ctl.open
                return <></>
            }
        }</Modal>
        <span onClick={open.current}>{props.children}</span>
    </IoCContext.Provider>
}