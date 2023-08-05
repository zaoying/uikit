import { NewIoCContext } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useState } from 'react';

const {define} = NewIoCContext("According")

export type AccordingProps = {
    summary: ReactNode
    children?: ReactNode
}

export const According: FC<AccordingProps> = define((props) => {
    const [collapse, setCollapse] = useState(true)
    return <div className={`according ${collapse ? "" : "show"}`}>
        <a className="summary" onClick={() => setCollapse(c => !c)}>
            {props.summary}
            <i className='icon'>{collapse ? "〉" : "﹀"}</i>
        </a>
        <div className="detail">
            {props.children}
        </div>
    </div>
})