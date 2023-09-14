import { createContext, useContext } from "react"
import { Context, Func, NewIoCContext } from "./ioc"

const GlobalDict = new Map<string, any>()

// 默认地域
export const defaultLocale: Intl.Locale = new Intl.Locale("en-us")

export const I18nContext = createContext<Intl.Locale>(defaultLocale)

/**
 * 根据默认地区获取国际化组件
 * @param component 国际化组件 
 * @returns 默认地区的国际化组件
 */
export function useI18n<I, O>(component: Func<I, O>): Func<I,O> {
    const locale = useContext(I18nContext)
    const localizeCtx = get(locale)
    return localizeCtx.inject(component)
}

/**
 * 批量注册国际化组件
 * @param locale 地域
 * @param callback 用于注册组件的回调函数
 */
export function register(locale: string, callback: (locale: Context) => void) {
    const key = new Intl.Locale(locale).toString()
    const localizeCtx = GlobalDict.get(key) ?? NewIoCContext()
    callback(localizeCtx)
    GlobalDict.set(key, localizeCtx)
}

/**
 * 根据不同的地区获取组件的上下文
 * @param locale 地域
 * @returns 组件的上下文
 */
export function get(locale: Intl.Locale) {
    const key = locale.toString()
    return GlobalDict.get(key) ?? NewIoCContext()
}

/**
 * 注册单个国际化组件
 * @param locale 地域
 * @param component 组件
 * @returns 返回带有componentId的组件
 */
export function i18n<I, O>(locale: string, component: Func<I, O>): Func<I, O> {
    const canonical = new Intl.Locale(locale)
    const localizeCtx = get(canonical)
    return localizeCtx.define(component)
}