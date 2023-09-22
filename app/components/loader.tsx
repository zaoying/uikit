import { FC, ReactNode, useEffect, useState } from "react";
import { i18n, register, useI18n } from "~/hooks/i18n";
import { useIoC } from "~/hooks/ioc";

export interface LoaderProps {
    icon?: ReactNode
    children?: ReactNode
}

export const Loader: FC<LoaderProps> = (props) => {
    const icon = props.icon ?? <i className="fan"></i>
    return <div className="loader">
        <span className="icon">{icon}</span>
        <span className="tip">{props.children}</span>
    </div>
}

export const LoaderDict = i18n("en-us", () => ({
    tip: "loading..."
}))

register("zh-cn", (context) => {
    context.define(LoaderDict, () => ({
        tip: "加载中..."
    }))
})

export interface WrapperProps {
    visible?: boolean
    icon?: ReactNode
    hint?: ReactNode
    children: FC<{toggle: (flag: boolean) => void}>
}

export const Wrapper: FC<WrapperProps> = (props) => {
    const context = useIoC()
    const loader = context.inject(Loader)
    const [visible, setVisible] = useState(props.visible ?? false)
    useEffect(() => setVisible(flag => props.visible ?? flag), [props])

    const dict = useI18n(LoaderDict)({})
    const hint = props.hint ?? dict.tip

    const className = `dimmer ${visible ? "show" : ""}`
    const toggle = (flag: boolean) => setVisible(flag)
    return <div className="wrapper">
        <div className={className}>
            {loader({icon: props.icon, children: hint})}
        </div>
        {props.children({toggle})}
    </div>
}