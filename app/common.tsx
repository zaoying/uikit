"use client";

import Footer from "Com/footer";
import { Menu } from "Com/menu";
import { ModalDict } from "Com/modal";
import Navbar from "Com/navbar";
import { Notification, Notifier } from 'Com/notification';
import { ReactNode, useEffect, useId, useState } from "react";
import { I18nContext, i18n, register, useI18n } from "./hooks/i18n";
import { IoCContext, NewIoCContext } from "./hooks/ioc";
import { Interceptor, InterceptorContext, NewInterceptors, useInterceptor } from "./hooks/resource";

export const MenuDict = i18n("en-us", () => ({
    menu: "Menu",
    user: "User Management",
    room: "Room Management",
    requestError: "Request error!"
}))

register("zh-cn", (locale) => {
    locale.define(ModalDict, () => ({ confirm: "确定", cancel: "取消" }))
    locale.define(MenuDict, () => ({
        menu: "菜单",
        user: "用户管理",
        room: "房间管理",
        requestError: "网络请求错误！"
    }))
})

function I18nMenu() {
    const menuDict = useI18n(MenuDict)({})
    return <Menu>
        <a className="button">{menuDict.menu}</a>
        <a href="/users">{menuDict.user}</a>
        <a href="/rooms">{menuDict.room}</a>
    </Menu>
}

function RequestErrorHandler(ctl: Notifier, requestError: string): Interceptor<any> {
    return (err: any) => {
        ctl.error(requestError);
        return err
    }
}

function I18nNotification() {
    const interceptors = useInterceptor()
    const dict = useI18n(MenuDict)({})
    const id = useId()
    return <Notification>{
        ({ctl}) => {
            const interceptor = RequestErrorHandler(ctl, dict.requestError)
            interceptor.id = id
            interceptors.onError(interceptor)
            return <></>
        }
    }</Notification>
    
}

export function CommonNavbar(props: { children: ReactNode }) {
    const [locale, setLocale] = useState("en-us")
    const [iocContext] = useState(NewIoCContext())
    const [interceptorContext] = useState(NewInterceptors())
    useEffect(() => {
        // 初始化默认地域
        const lang = navigator.languages?.length ? navigator.languages[0] : navigator.language;
        setLocale(lang)
    }, [])
    return <>
        <I18nContext.Provider value={new Intl.Locale(locale)}>
            <InterceptorContext.Provider value={interceptorContext}>
            <IoCContext.Provider value={iocContext}>
                <div className="main">
                    <I18nNotification></I18nNotification>
                    <Navbar>
                        <div className="left">
                            <a href="/" className="logo">
                                <i className="iconfont icon-answer blue medium"></i>
                                <span className="title">UIKIT</span>
                            </a>
                            <I18nMenu></I18nMenu>
                        </div>
                        <div className="right">
                            <Menu direction='right'>
                                <a className="button" title="international">
                                    <i className='iconfont icon-global'></i>
                                </a>
                                <a onClick={() => setLocale("en-us")}>English</a>
                                <a onClick={() => setLocale("zh-cn")}>简体中文</a>
                            </Menu>
                        </div>
                    </Navbar>
                    {props.children}
                    <Footer></Footer>
                </div>
            </IoCContext.Provider>
            </InterceptorContext.Provider>
        </I18nContext.Provider>
    </>
}