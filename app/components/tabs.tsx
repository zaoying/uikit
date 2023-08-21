import { FC, ReactNode, useEffect, useState } from 'react';
import { NewIoCContext, useIoC } from "../hooks/ioc";
import { K, PropsDispatcher, UniqueController } from './container';

const {define} = NewIoCContext()

export interface TabController extends UniqueController<TabItemProps> {
    setActiveTab(name: string): void
    closeAll(): void
}

export const TabPropsDispatcher: PropsDispatcher<TabProps> = define((props) => {})

export function NewTabController(setProps: PropsDispatcher<TabProps>): TabController {
    return {
        insert(tab) {
            setProps(p => {
                if (p.tabs) {
                    if (p.tabs.find(t => t.name == tab.name)) {
                        return p
                    }
                    return {...p, tabs: [...p.tabs, tab], activeTab: p.activeTab ?? tab.name}
                }
                return {...p, tabs: [tab]}
            })
        },
        update(tab) {
            const replace = (tabs: TabItemProps[]) => {
                const offset = tabs.findIndex(t => t.name == tab.name)
                return offset == -1 ? tabs : tabs.splice(offset, 1, tab)
            }
            setProps(p => p.tabs ? {...p, items: replace(p.tabs)}: p)
        },
        remove(name) {
            setProps(p => {
                if (!p.tabs) { return p }
                let offset = p.tabs.findIndex(t => t.name == name)
                if (offset == -1) {
                    return p
                }
                p.tabs.splice(offset, 1)
                let activeTab = p.tabs.length ? p.activeTab : ""
                if (activeTab == name) {
                    offset = offset < 1 ? 0 : offset - 1;
                    activeTab =  p.tabs[offset].name
                }
                return {...p, activeTab: activeTab}
            })
        },
        setActiveTab(name) {
            setProps(p => ({...p, activeTab: name}))
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
    const onRemove = (name: string) => (e: any) => {
        e.stopPropagation()
        ctl.remove(name)
    }
    return <ul className="list horizontal">
        {
            props.tabs?.map(tab => {
                const isActiveTab = props.activeTab == tab.name ? "active" : ""
                return <li key={tab.name} className={`item ${isActiveTab}`}>
                    <a onClick={() => ctl.setActiveTab(tab.name)}>
                        {tab.title ?? tab.name}
                        {tab.closeable && <i onClick={onRemove(tab.name)}>x</i>}
                    </a>
                </li>
            })
        }
    </ul>
})

export const TabBody: FC<TabProps> = define((props) => {
    return <>{
        props.tabs?.map(tab => {
            const isActiveTab = props.activeTab == tab.name ? "active" : ""
            return <div className={`content ${isActiveTab}`} key={tab.name}>
                {tab.children}
            </div>
        })
    }</>
})

export type TabItemProps = {
    name: string,
    title: ReactNode,
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
    children?: ReactNode
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