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
    onChange?: (val: number) => void
    validatePos?: (p: number) => number
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
                    const valid = props.validatePos ? props.validatePos(newLeft) : newLeft
                    const newVal = valid / props.sliderLen * (props.range.max - props.range.min)
                    setValue(newVal)
                    props.onChange && props.onChange(newVal)
                    return valid
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
        props.validatePos && props.validatePos(initial)
    }, [props])
    
    const className = `thumb ${shouldMove ? "active" : "" }`
    return <div className="track" style={{width: `${width}px`}}>
            <button name={props.name} value={props.value} title={value.toFixed(2)}
                 type="button" className={className} onMouseDown={onDown}
                onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
            {props.children}
        </button>
    </div>
}

export interface SliderArgs {
    ctx: Context,
    name: string
    range: Range,
    sliderLen: number
    validateLeftPos: (pos: number) => number
    validateRightPos: (pos: number) => number
}

export interface SliderProps extends Range {
    name: string
    id?: string
    threshold?: number
    validate?: (v: InputType) => string
    children: FC<SliderArgs>
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
    }, [sliderRef])

    const threshold = props.threshold ?? 15
    const position = useRef({left: -1, right: -1})
    const validateLeftPos = (pos: number) => {
        if (position.current.left <= 0) {
            position.current.left = pos
            return pos
        }
        if (pos + threshold > position.current.right) {
            return position.current.left
        }
        position.current.left = pos
        return pos
    }
    const validateRightPos = (pos: number) => {
        if (position.current.right <= 0) {
            position.current.right = pos
            return pos
        }
        if (pos - threshold < position.current.left) {
            return position.current.right
        }
        position.current.right = pos
        return pos
    }
    return <div className="slider" ref={sliderRef}>{
        props.children({
            ctx: context,
            name: props.name,
            range: props, 
            sliderLen: sliderLen,
            validateLeftPos: validateLeftPos,
            validateRightPos: validateRightPos,
        })
    }</div>
}