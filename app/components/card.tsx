import { FC, ReactNode } from 'react';

export type CardProps = {
    children: ReactNode
}

export const CardHeader: FC<CardProps> = (props) => {
    return <div className="header">
        {props.children}
    </div>
}

export const CardBody: FC<CardProps> = (props) => {
    return <div className="body">
        {props.children}
    </div>
}

export const CardFooter: FC<CardProps> = (props) => {
    return <div className="footer">
        {props.children}
    </div>
}

export const Card: FC<CardProps> = (props) => {
    return <div className="card">
        {props.children}
    </div>
}