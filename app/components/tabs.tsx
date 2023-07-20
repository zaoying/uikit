import { useIoC } from 'Com/app/hooks/ioc';
import { FC, ReactNode, useEffect, useState } from 'react';

const {define, inject} = useIoC()

export interface TabController {
    addTab(tabItem: TabItemProps): void
    setActiveTab(title: string): void
    removeTab(title: string): void
    closeAll(): void
}

export const NewTabController: ({}) => TabController = define(() => ({
    addTab(item){},
    setActiveTab(title){},
    removeTab(title){},
    closeAll(){}
}))

export const TabHeader: FC<TabProps> = define((props) => {
    const ctl = inject(NewTabController, props)({})
    return <ul className="list horizontal">
            {
                props.tabs?.map(item => {
                    const isActiveTab = props.activeTab == item.title ? "active" : ""
                    return <li key={item.title} className={`item ${isActiveTab}`}>
                        <a onClick={() => ctl.setActiveTab(item.title)}>
                            {item.title}<i onClick={() => ctl.removeTab(item.title)}>x</i>
                        </a>
                    </li>
                })
            }
        </ul>
})

export const TabBody: FC<TabProps> = define((props) => {
    return <>{
        props.tabs?.map(item => {
            const isActiveTab = props.activeTab == item.title ? "active" : ""
            return <div className={`content ${isActiveTab}`} key={item.title}>
                {item.children}
            </div>
        })
    }</>
})

export type TabItemProps = {
    title: string
    children: ReactNode
}

export const TabItem: FC<TabItemProps> = define((props) => {
    const ctl = inject(NewTabController, props)({})
    useEffect(() => ctl.addTab(props))
    return <></>
})

export type TabProps = {
    activeTab?: string
    tabs?: {title: string, children: ReactNode}[]
    children?: ReactNode
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

function setActiveTab(props: TabProps, title: string): TabProps {
    return {...props, activeTab: title}
}

function excludeTab(props: TabProps, title: string): TabProps {
    const tabs = props.tabs?.filter(item => item.title != title)
    return {...props, tabs: tabs}
}

function appendTabItem(props: TabProps, tabItem: TabItemProps): TabProps {
    if (props.tabs?.filter(tab => tab.title == tabItem.title).length) {
        return props
    }
    const tabs = props.tabs ? [...props.tabs, tabItem] : [tabItem]
    return {...props, tabs: tabs, activeTab: props.activeTab || tabs[0].title}
}

export function useTab(component?: FC<TabProps>): [ReactNode, TabController] {
    const tab = component ?? inject(Tab)
    const [props, setProps] = useState<TabProps>({
        activeTab: "",
        tabs: []
    })

    const ctl: TabController = {
        addTab(tabItem) {
            setProps(p => appendTabItem(p, tabItem))
        },
        removeTab(title) {
            setProps(p => excludeTab(p, title))
        },
        setActiveTab(title) {
            setProps(p => setActiveTab(p, title))
        },
        closeAll() {
            setProps(p => ({...p, tabs: []}))
        }
    }
    define(NewTabController, () => ctl)
    return [tab(props), ctl]
}