import { NewIoCContext } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useState } from 'react';

const {define} = NewIoCContext()

export type AccordingProps = {
    summary: ReactNode
    visible?: boolean
    children?: ReactNode
}

export const According: FC<AccordingProps> = define((props) => {
    const [visible, setVisible] = useState(props.visible)
    return <div className={`according ${visible ? "show" : ""}`}>
        <a className="summary" onClick={() => setVisible(c => !c)}>
            {props.summary}
            <i className='icon'>{visible ? "﹀" : "〉"}</i>
        </a>
        <div className="detail">
            {props.children}
        </div>
    </div>
})