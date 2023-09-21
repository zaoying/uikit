import { FC, useEffect, useState } from 'react';
import { i18n, register, useI18n } from '~/hooks/i18n';
import { Dropdown } from './dropdown';

export const PagerDict = i18n("en-us", () => ({
    sizeHint: (size: number) => `Each page shows ${size} items.`,
    pageSize: "Page Size: ",
    next: "Next page",
    pre: "Previous page",
    home: "Go to first page",
    end: "Go to last page",
    currentPageError: "current page must greater then 0.",
    sizeError: "page size must greater then 0.",
    totalError: "total must greater then 0.",
    intervalTooSmall: "interval must greater then 0."
}))

register("zh-cn", (context) => {
    context.define(PagerDict, () => ({
        sizeHint: (size: number) => `每页显示 ${size} 条目。`,
        pageSize: "页数: ",
        next: "下一页",
        pre: "上一页",
        home: "跳转到第一页",
        end: "跳转到最后一页",
        currentPageError: "当页页数必须大于0。",
        sizeError: "每页显示的条目必须大于0。",
        totalError: "总页数必须大于0。",
        intervalTooSmall: "页数范围必须大于0。"
    }))
})

export type PagerProps = {
    current?: number
    size?: number
    interval?: number
    onChange?: (page: number, size: number) => void
    children?: FC<{renew: (t: number) => void, total: number, current: number, size: number}>
}

export const Pager: FC<PagerProps> = (props) => {
    const dict = useI18n(PagerDict)({})
    const currentPage = props.current ? Math.floor(props.current) : 1
    const [current, setCurrent] = useState(currentPage)
    const pageSize = props.size ? Math.floor(props.size) : 10
    const [size, setSize] = useState(pageSize)
    useEffect(() => {
        setCurrent(c => props.current ? Math.floor(props.current) : c)
        setSize(s => props.size ? Math.floor(props.size) : s)
    }, [props])

    const [total, setTotal] = useState(1)
    if (currentPage < 1) {
        return <p className="error">{dict.currentPageError}</p>
    }

    if (size < 1) {
        return <p className="error">{dict.sizeError}</p>
    }

    const interval = props.interval ? Math.floor(props.interval) : Math.min(5, total);
    if (interval < 1) {
        return <p className="error">{dict.intervalTooSmall}</p>
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
        props.onChange && props.onChange(page, size)
        return page
    })
    const setPageSize = (pSize: number) => {
        setSize(pSize)
        props.onChange && props.onChange(current, pSize)
    }
    const previous = () => setPage(page => page > 1 ? page - 1 : page)
    const next = () => setPage(page => page < total ? page + 1 : page)
    const renew = (length: number) => {
        setTotal(Math.ceil(length / size))
    }
    return <div className="pager">
        {props.children && props.children({renew, total, current, size})}
        <label>
            {dict.pageSize}
        </label>
        <Dropdown>
            <span title={dict.sizeHint(size)}>{size}</span>
            <a key="top" onClick={() => setPageSize(5)}>5</a>
            <a key="bottom" onClick={() => setPageSize(10)}>10</a>
            <a key="left" onClick={() => setPageSize(20)}>20</a>
            <a key="right" onClick={() => setPageSize(50)}>50</a>
        </Dropdown>
        <ul className="list horizontal">
            <li className="item" onClick={() => setPage(1)} title={dict.home}>
                <i className="iconfont small icon-arrow-double-left"></i>
            </li>
            <li className="item" onClick={previous} title={dict.pre}>
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
            <li className="item" onClick={next} title={dict.next}>
                <i className="iconfont small icon-arrow-right"></i>
            </li>
            <li className="item" onClick={() => setPage(total)} title={dict.end}>
                <i className="iconfont small icon-arrow-double-right"></i>
            </li>
        </ul>
    </div>
}