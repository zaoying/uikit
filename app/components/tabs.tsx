import { FC, ReactNode, useEffect, useState } from 'react';
import { NewIoCContext, useIoC } from "../hooks/ioc";
import { K, PropsDispatcher, UniqueController } from './container';

const {define} = NewIoCContext()

export interface TabController extends UniqueController<TabItemProps> {
    setActiveTab(title: K): void
    closeAll(): void
}

export const TabPropsDispatcher: PropsDispatcher<TabProps> = define((props) => {})

export function NewTabController(setProps: PropsDispatcher<TabProps>): TabController {
    return {
        insert({title, children, closeable}) {
            const tab = { title: title, children: children, closeable }
            setProps(p => {
                if (p.tabs) {
                    if (p.tabs.find(t => t.title == title)) {
                        return p
                    }
                    return {...p, tabs: [...p.tabs, tab], activeTab: p.activeTab ?? title}
                }
                return {...p, tabs: [tab]}
            })
        },
        update({title, children, closeable}) {
            const replace = (tabs: TabItemProps[]) => {
                const tab = {title, children, closeable}
                const offset = tabs.findIndex(tab => tab.title == title)
                return offset == -1 ? tabs : tabs.splice(offset, 1, tab)
            }
            setProps(p => p.tabs ? {...p, items: replace(p.tabs)}: p)
        },
        remove(index) {
            setProps(p => {
                if (!p.tabs) { return p }
                let offset = p.tabs.findIndex((tab) => tab.title == index)
                if (offset == -1) {
                    return p
                }
                p.tabs.splice(offset, 1)
                let activeTab = p.tabs.length ? p.activeTab : ""
                if (activeTab == index) {
                    offset = offset < 1 ? 0 : offset - 1;
                    activeTab =  p.tabs[offset].title
                }
                return {...p, activeTab: activeTab}
            })
        },
        setActiveTab(title) {
            setProps(p => ({...p, activeTab: title}))
        },
        closeAll() {
            setProps(p => ({...p, items: []}))
        }
    }
}

export const TabHeader: FC<TabProps> = define((props) => {
    const context = useIoC()
    const setProps = context.inject(TabPropsDispatcher)
    const ctl = NewTabController(setProps)
    const onRemove = (title: K) => (e: any) => {
        e.stopPropagation()
        ctl.remove(title)
    }
    return <ul className="list horizontal">
        {
            props.tabs?.map(tab => {
                const isActiveTab = props.activeTab == tab.title ? "active" : ""
                return <li key={tab.title} className={`item ${isActiveTab}`}>
                    <a onClick={() => ctl.setActiveTab(tab.title)}>
                        {tab.title}
                        {tab.closeable && <i onClick={onRemove(tab.title)}>x</i>}
                    </a>
                </li>
            })
        }
    </ul>
})

export const TabBody: FC<TabProps> = define((props) => {
    return <>{
        props.tabs?.map(tab => {
            const isActiveTab = props.activeTab == tab.title ? "active" : ""
            return <div className={`content ${isActiveTab}`} key={tab.title}>
                {tab.children}
            </div>
        })
    }</>
})

export type TabItemProps = {
    title: K,
    closeable?: boolean,
    children: ReactNode
}

export const TabItem: FC<TabItemProps> = define((props) => {
    const context = useIoC()
    const setProps = context.inject(TabPropsDispatcher)
    const ctl = NewTabController(setProps)
    useEffect(() => ctl.insert(props))
    return <></>
})

export type TabProps = {
    activeTab?: K
    tabs?: TabItemProps[]
    children?: ReactNode[]
}

export const Tab: FC<TabProps> = define((old) => {
    const [props, setProps] = useState(old)
    const context = useIoC()
    context.define(TabPropsDispatcher, setProps)
    const tabHeader = context.inject(TabHeader)
    const tabBody = context.inject(TabBody)
    return <div className="tab">
            {props.children}
        <div className="header">
            {tabHeader(props)}
        </div>
        <div className="body">
            {tabBody(props)}
        </div>
    </div>
})