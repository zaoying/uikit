import { FC, useState } from 'react';

export type PagerProps = {
    current: number
    total: number
    interval?: number
    onChange?: (page: number) => void
}

export const Pager: FC<PagerProps> = (props) => {
    const currentPage = Math.floor(props.current)
    const [current, setCurrent] = useState(currentPage)
    if (currentPage < 1) {
        return <p className="error">current page must greater then 0.</p>
    }

    const total = Math.floor(props.total)
    if (total < 1) {
        return <p className="error">total page must greater then 0.</p>
    }
    if (total < current) {
        return <p className="error">total page must greater then current page.</p>
    }

    const interval = props.interval ? Math.floor(props.interval) : 5;
    if (interval < 1) {
        return <p className="error">interval must greater then 0.</p>
    }
    if (interval > total) {
        return <p className="error">interval must less then total page.</p>
    }

    const half = Math.floor(interval / 2)
    const leftGap = current - half
    const rightGap = total - current - half

    let start = leftGap > 0 ? leftGap : 1
    let end = rightGap > 0 ? current + half : total
    if (start == 1) {
        end = Math.min(start + interval - 1, total)
    } else if (end == total) {
        start = Math.max(1, end - interval + 1)
    }

    const pages = new Array<number>()
    for (let i = start; i <= end; i ++) {
        pages.push(i)
    }
    const setPage = (setter: number | ((page: number) => number)) => setCurrent(old => {
        const page = typeof setter == "function" ? setter(old) : setter
        props.onChange && props.onChange(page)
        return page
    })
    const previous = () => setPage(page => page > 1 ? page - 1 : page)
    const next = () => setPage(page => page < total ? page + 1 : page)
    return <div className="pager">
        <ul className="list horizontal">
            <li className="item" onClick={() => setPage(1)}>
                <i className="iconfont small icon-arrow-double-left"></i>
            </li>
            <li className="item" onClick={previous}>
                <i className="iconfont small icon-arrow-left"></i>
            </li>
            {
                pages.map(page => (
                    <li key={page} className={`item ${page == current ? "active" : ""}`}
                         onClick={() => setPage(page)}>
                        {page}
                    </li>
                ))
            }
            <li className="item" onClick={next}>
                <i className="iconfont small icon-arrow-right"></i>
            </li>
            <li className="item" onClick={() => setPage(total)}>
                <i className="iconfont small icon-arrow-double-right"></i>
            </li>
        </ul>
    </div>
}