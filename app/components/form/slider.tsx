import { Context, useIoC } from "Com/app/hooks/ioc";
import { FC, MouseEventHandler, ReactNode, useEffect, useRef, useState } from "react";
import { FormPropsDispatcher, InputType, NewFormController } from "./form";

export interface Range {
    min: number
    max: number
}

export interface SliderThumbProps {
    name: string
    value: number
    range: Range
    trackLen: number
    children?: ReactNode
}

export const SliderThumb: FC<SliderThumbProps> = (props) => {
    const [value, setValue] = useState(props.value)
    const [left, setLeft] = useState(0)
    const [shouldMove, setShouldMove] = useState(false)
    const [, setPositionX] = useState(0)
    const onDown: MouseEventHandler = (e) => {
        setPositionX(e.clientX)
        setShouldMove(true)
    }
    const onUp: MouseEventHandler = (e) => {
        setShouldMove(false)
    }
    const onMove: MouseEventHandler = (e) => {
        setPositionX(x => {
            setShouldMove(s => {
                s && setLeft(l => {
                    const offsetX = (e.clientX - x);
                    const newLeft = l + offsetX
                    setValue(newLeft / props.trackLen * (props.range.max - props.range.min))
                    return newLeft
                })
                return s
            })
            return e.clientX
        })
    }

    useEffect(() => {
        setValue(props.value)
        const initial = props.value / Math.abs(props.range.max - props.range.min) * props.trackLen
        setLeft(initial)
    }, [props])
    const style = {left: `${left}px`}
    const className = `thumb ${shouldMove ? "active" : "" }`
    return <button name={props.name} value={props.value} title={value.toFixed(2)}
            style={style} type="button" className={className} onMouseDown={onDown}
            onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
        {props.children}
    </button>
}

export interface SliderProps extends Range {
    name: string
    id?: string
    validate?: (v: InputType) => string
    children: FC<{ctx: Context, name: string, range: Range, trackLen: number}>
}

export const Slider: FC<SliderProps> = (props) => {
    const context = useIoC()
    const validate = function(v: InputType) {
        return props.validate && props.validate(v)
    }

    const setForm = context.inject(FormPropsDispatcher)
    const ctl = NewFormController(setForm)
    useEffect(() => ctl.insert({name: props.name, validate: validate}))
    
    const trackRef = useRef<HTMLDivElement>(null)
    const [trackLen, setTrackLen] = useState(0)
    useEffect(() => {
        const offsetWidth = trackRef.current?.offsetWidth ?? 0
        setTrackLen(offsetWidth)
    }, [])
    return <div className="slider">
        <div className="track" ref={trackRef}></div>
        {
            props.children({ctx: context, name: props.name, range: props, trackLen: trackLen})
        }
    </div>
}