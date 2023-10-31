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
    const localizeCtx = getOrCreate(locale)
    return localizeCtx.inject(component)
}

/**
 * 批量注册国际化组件
 * @param locale 地域
 * @param callback 用于注册组件的回调函数
 */
export function register(lang: string, callback: (locale: Context) => void) {
    const locale = new Intl.Locale(lang)
    const localizeCtx = getOrCreate(locale)
    callback(localizeCtx)
}

/**
 * 根据不同的地区获取组件的上下文
 * @param locale 地域
 * @returns 组件的上下文
 */
export function getOrCreate(locale: Intl.Locale) {
    const key = locale.toString()
    let ctx = GlobalDict.get(key)
    if (!ctx) {
        ctx = NewIoCContext()
        GlobalDict.set(key, ctx)
    }
    return ctx
}

/**
 * 注册单个国际化组件
 * @param locale 地域
 * @param component 组件
 * @returns 返回带有componentId的组件
 */
export function i18n<I, O>(locale: string, component: Func<I, O>): Func<I, O> {
    const canonical = new Intl.Locale(locale)
    const localizeCtx = getOrCreate(canonical)
    localizeCtx.define(component)
    return component
}