import { Context, Func, NewIoCContext } from "./ioc"

const GlobalDict = new Map<string, any>()

export function register<T>(locale: string, callback: (locale: Context) => void) {
    const key = new Intl.Locale(locale).toString()
    const localizeCtx = GlobalDict.get(key) ?? NewIoCContext()
    callback(localizeCtx)
    GlobalDict.set(key, localizeCtx)
}

export function get<T>(locale: string) {
    const key = new Intl.Locale(locale).toString()
    return GlobalDict.get(key) ?? NewIoCContext()
}

export function i18n<I, O>(locale: string, component: Func<I, O>): Func<I, O> {
    const canonical = new Intl.Locale(locale).toString()
    const localizeCtx = get(canonical)
    return localizeCtx.define(component)
}

export function useI18n<I, O>(dict: Func<I, O>): Func<I,O> {
    if (!navigator) {
        return dict
    }
    const locale = navigator.languages?.length ? navigator.languages[0] : navigator.language;
    const localizeCtx = get(locale)
    return localizeCtx.inject(dict)
}