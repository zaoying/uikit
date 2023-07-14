import { useIoC } from "Com/app/hooks/ioc"
import { Button, ButtonChildren } from "./button"
import { FC } from "react"

const {define, inject} = useIoC()

export const IconButtonChild = define(ButtonChildren, () => <span><i>🎨</i>打开模态框</span>)

export const IconButton: FC<{onClick?: () => void}> = define((props) => {
    const button = inject(Button, props)
    return <>{button(props)}</>
})
