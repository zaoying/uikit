import { NewIoCContext } from 'Com/app/hooks/ioc';
import { FC, ReactNode } from 'react';

const {define} = NewIoCContext()

export type BreadcrumbProps = {
    seperator?: string
    children?: ReactNode[]
}

export const Breadcrumb: FC<BreadcrumbProps> = define((props) => {
    const length = props.children ? props.children.length - 1 : 0
    const seperator = props.seperator ?? "⟩"
    return <ul className="breadcrumb">
        {
            props.children?.map((child, i) => (
                <li key={i} className="item">
                    {child}
                    {
                        i != length && <i className='icon'>{seperator}</i>
                    }
                </li>
            ))
        }
    </ul>
})