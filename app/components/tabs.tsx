import { FC, ReactNode, useEffect, useState } from 'react';
import { useIoC as newIoC } from "../hooks/ioc";
import { K, NewUniqueController, UniqueController } from './container';

const {define, inject} = newIoC()

export interface TabController extends UniqueController {
    setActiveTab(title: K): void
    closeAll(): void
}

export const NewTabController: ({}) => TabController = define(() => ({
    get(title){ return null },
    insert(title, child){},
    update(title, child){},
    remove(title){},
    setActiveTab(title){},
    closeAll(){}
}))

export const TabHeader: FC<TabProps> = define((props) => {
    const ctl = inject(NewTabController, props)({})
    return <ul className="list horizontal">
            {
                props.tabs?.map(tab => {
                    const isActiveTab = props.activeTab == tab.title ? "active" : ""
                    return <li key={tab.title} className={`item ${isActiveTab}`}>
                        <a onClick={() => ctl.setActiveTab(tab.title)}>
                            {tab.title}<i onClick={() => ctl.remove(tab.title)}>x</i>
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
    children: ReactNode
}

export const TabItem: FC<TabItemProps> = define((props) => {
    const ctl = inject(NewTabController, props)({})
    useEffect(() => ctl.insert(props.title, props.children))
    return <></>
})

export type TabProps = {
    activeTab?: K
    tabs?: TabItemProps[]
    children?: ReactNode[]
}

export const Tab: FC<TabProps> = define((props) => {
    const tabHeader = inject(TabHeader, props)
    const tabBody = inject(TabBody, props)
    return (<div className="tab">
        <div className="header">
            {tabHeader(props)}
        </div>
        <div className="body">
            {props.children}
            {tabBody(props)}
        </div>
    </div>)
})

export function useTab(component?: FC<TabProps>): [ReactNode, TabController] {
    const tab = component ?? inject(Tab)
    const [props, setProps] = useState<TabProps>({
        activeTab: "",
        tabs: []
    })

    const items = props.tabs?.map((item) => ({key: item.title, children: item.children}))
    const ctnProps = {
        items: items ?? [],
        children: props.children ?? []
    }
    const controller = NewUniqueController(ctnProps)
    const ctl: TabController = {
        ...controller,
        setActiveTab(title) {
            setProps(p => ({...p, activeTab: title}))
        },
        closeAll() {
            setProps(p => ({...p, items: []}))
        }
    }
    define(NewTabController, () => ctl)
    return [tab(props), ctl]
}