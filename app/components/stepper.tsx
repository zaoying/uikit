import { FC, ReactNode, useEffect, useState } from 'react';
import { Context, useIoC } from "../hooks/ioc";
import { PropsDispatcher } from './container';
import { Once } from './once';

export type StepperItemProps = {
    title: ReactNode
    children: ReactNode
}

export type StepperPops = {
    step?: number
    items?: StepperItemProps[]
    children?: FC<{ctx: Context, ctl: StepperController}>
}

export interface StepperController {
    insert(item: StepperItemProps): void
    jump(step: number): void
    previous(): void
    next(): void
}

export const StepperPropsDispatcher: PropsDispatcher<StepperPops> = (props) => {}

export function NewStepperController(setProps: PropsDispatcher<StepperPops>): StepperController {
    return {
        insert(item) {
            setProps(p => ({...p, items: p.items ? [...p.items, item]: [item]}))
        },
        jump(step) {
            setProps(p => ({...p, step: step}))
        },
        previous() {
            setProps(p => {
                const step = p.step ?? 0
                return {...p, step: step > 0 ? step - 1: 0}
            })
        },
        next() {
            setProps(p => {
                const last = p.items ? p.items.length - 1 : 0
                const step = p.step ?? 0
                return {...p, step: step < last ? step + 1: last}
            })
        },
    }
}

export const StepperItem: FC<StepperItemProps> = (props) => {
    const context = useIoC()
    const setProps = context.inject(StepperPropsDispatcher)
    const ctl = NewStepperController(setProps)
    useEffect(() => ctl.insert(props))
    return <></>
}

export const StepperHeader: FC<StepperPops> = (props) => {
    return <ul className="horizontal list">{
        props.items?.map((item, i) => {
            const step = props.step ?? 0
            const passed = step >= i ? "passed" : ""
            return <li key={i} className={`item ${passed}`}>
                <i className="icon">{passed ? "✔" : i + 1}</i>
                {item.title}
                <span className="divider"></span>
            </li>
        })
    }</ul>
}

export const StepperBody: FC<StepperPops> = (props) => {
    return <>{
        props.items?.map((item, i) => {
            const isActive = props.step == i ? "active" : ""
            return <div key={i} className={`content ${isActive}`}>
                {item.children}
            </div>
        })
    }</>
}

export const Stepper: FC<StepperPops> = (old) => {
    const [props, setProps] = useState<StepperPops>({...old, step: old.step ?? 0})
    const context = useIoC()
    context.define(StepperPropsDispatcher, setProps)
    const header = context.inject(StepperHeader)
    const body = context.inject(StepperBody)
    return <>
        <Once>{
            () => props.children && props.children({ctx: context, ctl: NewStepperController(setProps)})
        }</Once>
        <div className="stepper">
            <div className="center header">
                {header(props)}
            </div>
            <div className="body">
                {body(props)}
            </div>
        </div>
    </>
}