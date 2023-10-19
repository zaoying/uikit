import { createContext, useContext } from "react";
import { Context, Func, NewIoCContext } from "./ioc";

export type Theme = "system" | "light" | "dark";

export const ThemeContext = createContext<Theme>("system")

export function NewThemeContext(): Theme {
    const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    return isDarkTheme ? "dark" : "light"
}

export function useTheme() {
    return useContext(ThemeContext)
}

export const globalThemeContext = new Map<Theme, Context>()

export function useStyle<I, O>(style: Func<I,O>): Func<I,O> {
    const theme = useTheme()
    const context = globalThemeContext.get(theme)
    return context ? context.inject(style) : style
}

export function getOrCreate(theme: Theme): Context {
    let context = globalThemeContext.get(theme)
    if (!context) {
        context = NewIoCContext()
        globalThemeContext.set(theme, context)
    }
    return context
}

export function themed<I,O>(theme: Theme, style: Func<I,O>, subStyle?: Func<I,O>): Func<I,O> {
    const context = getOrCreate(theme)
    return context.define(style, subStyle)
}

export function light<I,O>(style: Func<I,O>, subStyle?: Func<I,O>): Func<I,O> {
    return themed("light", style, subStyle)
}

export function dark<I,O>(style: Func<I,O>, subStyle?: Func<I,O>): Func<I,O> {
    return themed("dark", style, subStyle)
}