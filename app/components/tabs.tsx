import { FC, ReactNode, useEffect, useState } from 'react';
import { useIoC } from "../hooks/ioc";
import { Controller, NameEqualizer, NewController, PropsDispatcher } from './container';

export type TabItemProps = {
    name: string,
    title: ReactNode,
    closeable?: boolean,
    children: ReactNode
}

export type TabProps = {
    activeTab?: string
    children: ReactNode
}

interface TP {
    activeTab: string
    tabs: TabItemProps[]
}

export const TabPropsDispatcher: PropsDispatcher<TP> = (props) => {}

export const TabItem: FC<TabItemProps> = (props) => {
    const context = useIoC()
    const setProps = context.inject(TabPropsDispatcher)
    useEffect(() => {
        const ctl = NewTabController(setProps)
        ctl.insert(props)
    }, [props, setProps])
    return <></>
}

export interface TabController extends Controller<TabItemProps> {
    setActiveTab(name: string): void
    closeAll(): void
}

export function NewTabController(setProps: PropsDispatcher<TP>): TabController {
    const setTabs: PropsDispatcher<TabItemProps[]> = (action) => setProps(p => {
        const tabs = (typeof action == "function") ? action(p.tabs) : action
        return {...p, tabs: tabs}
    })
    const ctl = NewController(setTabs, NameEqualizer)
    return {
        insert(tab) {
            ctl.insert(tab)
            setProps(p => p.activeTab == "" ? {...p, activeTab: tab.name} : p)
        },
        update(tab) {
            ctl.update(tab)
        },
        remove(tab) {
            setProps(p => {
                let offset = p.tabs.findIndex(t => t.name == tab.name)
                if (offset == -1) {
                    return p
                }
                p.tabs.splice(offset, 1)
                if (p.activeTab == tab.name) {
                    offset = offset < 1 ? 0 : offset - 1;
                    const activeTab =  p.tabs[offset].name
                    return {...p, activeTab: activeTab}
                }
                return {...p}
            })
        },
        setActiveTab(name) {
            setProps(p => ({...p, activeTab: name}))
        },
        closeAll() {
            setProps(p => ({...p, tabs: []}))
        }
    }
}

export const TabHeader: FC<TP> = (props) => {
    const context = useIoC()
    const setProps = context.inject(TabPropsDispatcher)
    const ctl = NewTabController(setProps)
    const onRemove = (item: TabItemProps) => (e: any) => {
        e.stopPropagation()
        ctl.remove(item)
    }
    return <ul className="list horizontal">{
        props.tabs.map(tab => {
            const isActiveTab = props.activeTab == tab.name ? "active" : ""
            return <li key={tab.name} className={`item ${isActiveTab}`}>
                <a onClick={() => ctl.setActiveTab(tab.name)}>
                    {tab.title ?? tab.name}
                    {tab.closeable && <i onClick={onRemove(tab)}>x</i>}
                </a>
            </li>
        })
    }</ul>
}

export const TabBody: FC<TP> = (props) => {
    return <>{
        props.tabs.map(tab => {
            const isActiveTab = props.activeTab == tab.name ? "active" : ""
            return <div className={`content ${isActiveTab}`} key={tab.name}>
                {tab.children}
            </div>
        })
    }</>
}

export const Tab: FC<TabProps> = (old) => {
    const [props, setProps] = useState<TP>({activeTab: "", tabs: []})
    const context = useIoC()
    context.define(TabPropsDispatcher, setProps)
    const tabHeader = context.inject(TabHeader)
    const tabBody = context.inject(TabBody)
    return <div className="tab">
            {old.children}
        <div className="header">
            {tabHeader(props)}
        </div>
        <div className="body">
            {tabBody(props)}
        </div>
    </div>
}