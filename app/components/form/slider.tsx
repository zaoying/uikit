import { Context, useIoC } from "Com/app/hooks/ioc";
import { FC, MouseEventHandler, ReactNode, useEffect, useRef, useState } from "react";
import { FormPropsDispatcher, InputType, NewFormController } from "./form";

export interface Range {
    min: number
    max: number
}

export interface SliderTrackProps {
    name: string
    value: number
    range: Range
    sliderLen: number
    first?: boolean
    children?: ReactNode
}

export const SliderTrack: FC<SliderTrackProps> = (props) => {
    const [value, setValue] = useState(props.value)
    const [width, setWidth] = useState(0)
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
                s && setWidth(l => {
                    const offsetX = (e.clientX - x);
                    const newLeft = l + offsetX
                    setValue(newLeft / props.sliderLen * (props.range.max - props.range.min))
                    return newLeft
                })
                return s
            })
            return e.clientX
        })
    }

    useEffect(() => {
        setValue(props.value)
        const initial = props.value / Math.abs(props.range.max - props.range.min) * props.sliderLen
        setWidth(initial)
    }, [props])
    const style = {width: `${width}px`}
    const className = `thumb ${shouldMove ? "active" : "" }`
    return <div className={`track ${props.first ? "first" : ""}`} style={style}>
            <button name={props.name} value={props.value} title={value.toFixed(2)}
                 type="button" className={className} onMouseDown={onDown}
                onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
            {props.children}
        </button>
    </div>
}

export interface SliderProps extends Range {
    name: string
    id?: string
    validate?: (v: InputType) => string
    children: FC<{ctx: Context, name: string, range: Range, sliderLen: number}>
}

export const Slider: FC<SliderProps> = (props) => {
    const context = useIoC()
    const validate = function(v: InputType) {
        return props.validate && props.validate(v)
    }

    const setForm = context.inject(FormPropsDispatcher)
    const ctl = NewFormController(setForm)
    useEffect(() => ctl.insert({name: props.name, validate: validate}))
    
    const sliderRef = useRef<HTMLDivElement>(null)
    const [sliderLen, setSliderLen] = useState(0)
    useEffect(() => {
        const offsetWidth = sliderRef.current?.offsetWidth ?? 0
        setSliderLen(offsetWidth)
    }, [])
    return <div className="slider" ref={sliderRef}>
        {
            props.children({ctx: context, name: props.name, range: props, sliderLen: sliderLen})
        }
    </div>
}