"use client";

import Footer from "Com/footer";
import { Menu } from "Com/menu";
import { ModalDict } from "Com/modal";
import Navbar from "Com/navbar";
import { Notification } from 'Com/notification';
import { ReactNode, useEffect, useState } from "react";
import { I18nContext, i18n, register, useI18n } from "./hooks/i18n";
import { IoCContext, NewIoCContext } from "./hooks/ioc";

export const MenuDict = i18n("en-us", () => ({
    menu: "Menu",
    user: "User Management",
    room: "Room Management"
}))

register("zh-cn", (locale) => {
    locale.define(ModalDict, () => ({ confirm: "确定", cancel: "取消" }))
    locale.define(MenuDict, () => ({ menu: "菜单", user: "用户管理", room: "房间管理" }))
})

function I18nMenu() {
    const menuDict = useI18n(MenuDict)({})
    return <Menu>
        <a className="button">{menuDict.menu}</a>
        <a href="/users">{menuDict.user}</a>
        <a href="/rooms">{menuDict.room}</a>
    </Menu>
}

export function CommonNavbar(props: { children: ReactNode }) {
    const [locale, setLocale] = useState("en-us")
    useEffect(() => {
        // 初始化默认地域
        const lang = navigator.languages?.length ? navigator.languages[0] : navigator.language;
        setLocale(lang)
    }, [])
    return <>
        <I18nContext.Provider value={new Intl.Locale(locale)}>
            <IoCContext.Provider value={NewIoCContext()}>
                <div className="main">
                    <Notification>{() => <></>}</Notification>
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
        </I18nContext.Provider>
    </>
}