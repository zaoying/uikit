import { FC, ReactNode } from "react";

export interface LoaderProps {
    icon?: ReactNode
    children?: ReactNode
}

export const Loader: FC<LoaderProps> = (props) => {
    const icon = props.icon ?? <i className="fan"></i>
    return <div className="loader">
        <span className="icon">{icon}</span>
        <span className="tip">{props.children}</span>
    </div>
}