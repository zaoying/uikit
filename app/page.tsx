"use client";

import { useState } from "react";
import { According } from "./components/according";
import { Button } from "./components/basic/button";
import { Dropdown } from "./components/dropdown";
import { Form, FormPropsDispatcher, FormRefrence, InputType, NewFormController } from "./components/form/form";
import { Input } from "./components/form/input";
import { Label } from "./components/form/label";
import { List } from "./components/list";
import { Body, Footer, Header, Hint, Modal, ModalPropsDispatcher, NewModalController } from "./components/modal";
import { useNotification } from "./components/notification";
import { Tab, TabItem } from "./components/tabs";
import { Direction, Tooltip } from "./components/tooltip";
import { IoCContext, NewIoCContext, useIoC } from "./hooks/ioc";

const { define, inject } = NewIoCContext()

define(Header, () => <p className="title">修改密码</p>)

define(Hint, () => ({ confirm: "确认", cancel: "取消" }))

define(Body, () => {
    const checkPassword = (val: InputType) => {
        if (!val) return "密码不能为空"
        return ""
    }
    return <Form action="">
        <Label label="用户名">
            <Input name="username" value="admin" />
        </Label>
        <Label label="旧密码">
            <Input name="oldPWD" type="password" validate={checkPassword} />
        </Label>
        <Label label="新密码">
            <Input name="newPWD" type="password" validate={checkPassword} />
        </Label>
        <Label label="重复密码">
            <Input name="repeat" type="password" validate={checkPassword} />
        </Label>
    </Form>
})

define(Footer, () => {
    const context = useIoC()
    const onConfirm = () => {
        const setForm = context.inject(FormPropsDispatcher)
        const formCtl = NewFormController(setForm)
        const formRef = context.inject(FormRefrence)({})
        formCtl.validate(formRef)
        formCtl.submit()
        return true
    }
    return <Footer onConfirm={onConfirm}></Footer>
})

export default function Home() {
    const [notification, notifier] = useNotification()
    const openModal = () => {
        const setProps = inject(ModalPropsDispatcher)
        const ctl = NewModalController(setProps)
        ctl.open()
    }
    const [direct, setDirect] = useState<Direction>("bottom")
    return (<IoCContext.Provider value={{ define, inject }}>
        <div>
            <p>Icon Button:
                <Button onClick={openModal}>
                    <span><i>🎨</i>打开模态框</span>
                </Button>
            </p>
            <div>Normal Button: 
                <Tooltip message="普通按钮" direction={direct}>
                    <Button>普通按钮</Button>
                </Tooltip>
                <Dropdown trigger="click">
                    <Button type="grey">请选择方向<i className="icon">﹀</i></Button>
                    <a onClick={()=> setDirect("top")}>上</a>
                    <a onClick={()=> setDirect("bottom")}>下</a>
                    <a onClick={()=> setDirect("left")}>左</a>
                    <a onClick={()=> setDirect("right")}>右</a>
                </Dropdown>
            </div>
            <Modal width={360}></Modal>
            <List type="horizontal">
                <Button onClick={() => notifier.info("info")}>通知</Button>
                <Button onClick={() => notifier.warn("warn")}>警告</Button>
                <Button onClick={() => notifier.error("error")}>错误</Button>
            </List>
            {notification}
            <Tab activeTab="abc">
                <TabItem title="abc">123</TabItem>
                <TabItem title="def">456</TabItem>
                <TabItem title="ghi">789</TabItem>
            </Tab>
            <According summary="标题" visible={true}>详情</According>
        </div>
    </IoCContext.Provider>);
}
