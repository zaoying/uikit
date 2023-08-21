import { FC, ReactNode, useEffect, useState } from "react"

export type OnceProps = {
    children: FC
}

export function Once(props: OnceProps) {
    const [children, setChildren] = useState<ReactNode>()
    useEffect(() => {
        if (!children) setChildren(props.children({}))
    }, [children, props])
    return <>
        {children}
    </>
}