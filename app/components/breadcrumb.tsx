import { FC, ReactNode } from 'react';

export type BreadcrumbProps = {
    separator?: ReactNode
    children?: ReactNode[]
}

export const Breadcrumb: FC<BreadcrumbProps> = (props) => {
    const length = props.children ? props.children.length - 1 : 0
    const separator = props.separator ?? <i className="icon iconfont icon-slash small"></i>
    return <ul className="breadcrumb">
        {
            props.children?.map((child, i) => (
                <li key={i} className="item">
                    {child}
                    {
                        i != length && separator
                    }
                </li>
            ))
        }
    </ul>
}