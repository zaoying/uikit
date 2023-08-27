import { FC, ReactNode } from "react"
import { IoCContext, NewIoCContext, useIoC } from "../hooks/ioc"
import { Body, Modal } from "./modal"

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
    context.define(Body, () => <>{props.content}</>)
    
    const onConfirm = () => {props.onConfirm && props.onConfirm(); return false;}
    const onCancel = () => {props.onCancel && props.onCancel(); return false;}
    return <IoCContext.Provider value={context}>
        <Modal className="dialog" title={props.title} width={240} >{
            ({ctl}) => {
                ctl.onConfirm(onConfirm)
                ctl.onCancel(onCancel)
                return <span onClick={ctl.open}>{props.children}</span>
            }
        }</Modal>
    </IoCContext.Provider>
}