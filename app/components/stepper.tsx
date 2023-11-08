import { FC, ReactNode, useEffect, useId, useRef, useState } from 'react';
import { Context, useIoC } from "../hooks/ioc";
import { Controller, IDEqualizer, NewController, PropsDispatcher } from './container';
import { Once } from './once';

export interface StepperItemProps {
    title: ReactNode
    children: ReactNode
}

interface SIP extends StepperItemProps {
    id: string
}

export type StepperPops = {
    step?: number
    children: FC<{ctx: Context, ctl: StepperController}>
}

interface SP {
    step: number
    items: SIP[]
}

export interface StepperController extends Controller<SIP> {
    updateOrInsert(item: SIP): void
    jump(step: number): void
    previous(): void
    next(): void
}

export const StepperPropsDispatcher: PropsDispatcher<SP> = (props) => {}

export function NewStepperController(setProps: PropsDispatcher<SP>): StepperController {
    const setItems: PropsDispatcher<SIP[]> = (action) => setProps(p => {
        const items = (typeof action == "function") ? action(p.items) : action
        return {...p, items: items}
    })
    const ctl = NewController(setItems, IDEqualizer)
    return {
        ...ctl,
        updateOrInsert(item) {
            setProps(p => {
                const index = p.items.findIndex(it => it.id == item.id)
                if (index >= 0) {
                    p.items[index] = item
                    return {...p, items: [...p.items]}
                }
                return {...p, items: [...p.items, item]}
            })
        },
        jump(step) {
            setProps(p => {
                let s = Math.floor(step)
                s = Math.max(0, s)
                s = Math.min(s, p.items.length - 1)
                return {...p, step: s}
            })
        },
        previous() {
            setProps(p => {
                const step = p.step ?? 0
                return {...p, step: step > 0 ? step - 1: 0}
            })
        },
        next() {
            setProps(p => {
                const last = p.items.length - 1
                const step = p.step ?? 0
                return {...p, step: step < last ? step + 1: last}
            })
        }
    }
}

export const StepperItem: FC<StepperItemProps> = (props) => {
    const context = useIoC()
    const setProps = context.inject(StepperPropsDispatcher)
    const ctl = NewStepperController(setProps)
    const id = useRef(useId())
    useEffect(() => ctl.updateOrInsert({...props, id: id.current}), [props, ctl])
    return <></>
}

export const StepperHeader: FC<SP> = (props) => {
    return <ul className="horizontal list">{
        props.items.map((item, i) => {
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

export const StepperBody: FC<SP> = (props) => {
    return <>{
        props.items.map((item, i) => {
            const isActive = props.step == i ? "active" : ""
            return <div key={i} className={`content ${isActive}`}>
                {item.children}
            </div>
        })
    }</>
}

export const Stepper: FC<StepperPops> = (old) => {
    const [props, setProps] = useState<SP>({items: [], step: old.step ?? 0})
    const context = useIoC()
    context.define(StepperPropsDispatcher, setProps)
    const header = context.inject(StepperHeader)
    const body = context.inject(StepperBody)

    const ctl = NewStepperController(setProps)
    return <>
        <Once>{
            () => old.children({ctx: context, ctl: ctl})
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