"use client";

import Link from "next/link";
import { useEffect } from "react";
import { According } from "../app/components/according";
import { Button } from "../app/components/basic/button";
import { Breadcrumb } from "../app/components/breadcrumb";
import { Card, CardBody, CardFooter, CardHeader } from "../app/components/card";
import { Dialog } from "../app/components/dialog";
import { Dropdown } from "../app/components/dropdown";
import { Slider, SliderTrack } from "../app/components/form/slider";
import { Spinner } from "../app/components/form/spinner";
import { List } from "../app/components/list";
import { Loader } from "../app/components/loader";
import { Menu } from "../app/components/menu";
import { ModalDict } from "../app/components/modal";
import { Notification } from "../app/components/notification";
import { Progress } from "../app/components/progress";
import { Tab, TabItem } from "../app/components/tabs";
import { Tooltip } from "../app/components/tooltip";
import { WithState } from "../app/components/with";
import { initLocale, register } from "../app/hooks/i18n";
import { IoCContext, NewIoCContext } from "../app/hooks/ioc";
import { Direction } from "../app/utils/centered";
import "./globals.css";

const globalContext = NewIoCContext()

register("zh-cn", (locale) => {
    locale.define(ModalDict, () => ({confirm: "确定", cancel: "取消"}))
})

export default function Home() {
    useEffect(() => initLocale())
    return (<IoCContext.Provider value={globalContext}>
        <div className="main">
            <Menu>
                <a className="grey button">个人</a>
                <a>设置</a>
                <a>退出</a>
            </Menu>
            <Breadcrumb>
                <Link className="link" href="/">主页</Link>
                <Link className="link" href="/users">用户管理</Link>
            </Breadcrumb>
            <Card>
                <CardHeader>
                    <p title="title">卡片</p></CardHeader>
                <CardBody>
                    <Loader>加载中...</Loader>
                    <Progress percentage={40}></Progress>
                </CardBody>
                <CardFooter>
                    <Dialog title="对话框" content={<p>点击按钮关闭</p>}>
                        <Button>打开对话框</Button>
                    </Dialog>
                </CardFooter>
            </Card>
            <div>
                <WithState state={"bottom" as Direction}>{
                    ({state, setState}) => <>
                        <Tooltip message="普通按钮" direction={state}>
                            <Button>普通按钮</Button>
                        </Tooltip>
                        <Dropdown trigger="click">
                            <Button type="grey">请选择方向<i className="icon">﹀</i></Button>
                            <a key="top" onClick={()=> setState("top")}>上</a>
                            <a key="bottom"  onClick={()=> setState("bottom")}>下</a>
                            <a key="left"  onClick={()=> setState("left")}>左</a>
                            <a key="right"  onClick={()=> setState("right")}>右</a>
                        </Dropdown>
                    </>
                }</WithState>
                <Spinner name="money" min={0} max={100} value={10}></Spinner>
            </div>
            <Slider name="percentage" min={0} max={100}>{
                (parent) => <>
                    <SliderTrack {...parent} value={20} validatePos={parent.validateLeftPos}></SliderTrack>
                    <SliderTrack {...parent} value={70} validatePos={parent.validateRightPos}></SliderTrack>
                </>
            }</Slider>
            <Notification>{
                ({ctl}) => <List type="horizontal">
                    <Button onClick={() => ctl.info("info")}>通知</Button>
                    <Button onClick={() => ctl.warn("warn")}>警告</Button>
                    <Button onClick={() => ctl.error("error")}>错误</Button>
                </List>
            }</Notification>
            
            <Tab activeTab="abc">
                <TabItem name="abc" title="abc">123</TabItem>
                <TabItem name="def" title="def">456</TabItem>
                <TabItem name="ghi" title="ghi">789</TabItem>
            </Tab>
            <According summary="标题" visible={true}>详情</According>
        </div>
    </IoCContext.Provider>);
}
