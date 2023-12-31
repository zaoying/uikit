"use client";

import Footer from "Com/footer";
import { Switch } from "Com/form/switch";
import { Menu } from "Com/menu";
import { ModalDict } from "Com/modal";
import Navbar from "Com/navbar";
import { Notification, Notifier } from 'Com/notification';
import { ReactNode, useEffect, useId, useState } from "react";
import { I18nContext, i18n, register, useI18n } from "./hooks/i18n";
import { IoCContext, NewIoCContext } from "./hooks/ioc";
import { Interceptor, InterceptorContext, NewInterceptors, useInterceptor } from "./hooks/resource";
import { NewThemeContext, Theme, ThemeContext } from "./hooks/style";

const lightBG = "rgba(255, 255, 255, 0.75)"
const darkBG = "rgba(17, 25, 40, 0.75)"
const lightBorder = "rgba(209, 213, 219, 0.3)"
const darkBorder = "rgba(255, 255, 255, 0.125)"

export const MenuDict = i18n("en-us", () => ({
    menu: "Menu",
    user: "User Management",
    room: "Room Management",
    light: "Light",
    dark: "Dark",
    requestError: "Request error!"
}))

register("zh-cn", (locale) => {
    locale.define(ModalDict, () => ({ confirm: "确定", cancel: "取消" }))
    locale.define(MenuDict, () => ({
        menu: "菜单",
        user: "用户管理",
        room: "房间管理",
        light: "明亮",
        dark: "暗黑",
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

function ThemeSwitch(props: {theme: Theme, toggleTheme: (f: boolean) => void}) {
    const dict = useI18n(MenuDict)({})
    const sunIcon = <>
        <i className="iconfont dot orange small icon-sun"></i>
        <span className="label">{dict.light}</span>
    </>
    const moonIcon = <>
        <span className="label">{dict.dark}</span>
        <i className="iconfont dot white small icon-moon"></i>
    </>
    return <Switch name="theme" onToggle={props.toggleTheme}>
        { props.theme === "light" ? sunIcon : moonIcon}
    </Switch>
}

export function CommonNavbar(props: { children: ReactNode }) {
    const [locale, setLocale] = useState("en-us")
    const [iocContext] = useState(NewIoCContext())
    const [interceptorContext] = useState(NewInterceptors())
    const [theme, setTheme] = useState<Theme>("system")
    const toggleTheme = (flag: boolean) => {
        setTheme(t => t === "dark" ? "light" : "dark")
        return !flag
    }
    useEffect(() => {
        // 初始化默认地域
        const lang = navigator.languages?.length ? navigator.languages[0] : navigator.language;
        setLocale(lang)
        setTheme(NewThemeContext())
    }, [])
    useEffect(() => {
        var declaration = document.body.style;
        declaration.setProperty("--fore-color", theme == "dark" ? "white" : "black")
        declaration.setProperty("--bg-color", theme == "dark" ? darkBG : lightBG)
        declaration.setProperty("--border-color", theme == "dark" ? darkBorder : lightBorder)
        declaration.setProperty("--thirty-three", theme == "dark" ? "#99999999" : "#33333333")
        declaration.setProperty("--sixty-six", theme == "dark" ? "#eeeeeeee" : "#33333333")
    }, [theme])
    return <>
        <I18nContext.Provider value={new Intl.Locale(locale)}>
            <ThemeContext.Provider value={theme}>
            <InterceptorContext.Provider value={interceptorContext}>
            <IoCContext.Provider value={iocContext}>
                <div className="main glass">
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
                            <ThemeSwitch theme={theme} toggleTheme={toggleTheme}></ThemeSwitch>
                        </div>
                    </Navbar>
                    {props.children}
                    <Footer></Footer>
                </div>
            </IoCContext.Provider>
            </InterceptorContext.Provider>
            </ThemeContext.Provider>
        </I18nContext.Provider>
    </>
}