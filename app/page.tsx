"use client";

import { useState } from "react";
import { According } from "./components/according";
import { Button } from "./components/basic/button";
import { Link } from "./components/basic/link";
import { Breadcrumb } from "./components/breadcrumb";
import { Dropdown } from "./components/dropdown";
import { Form, FormPropsDispatcher, FormReference, InputType, NewFormController } from "./components/form/form";
import { Input } from "./components/form/input";
import { Label } from "./components/form/label";
import { Select, SelectItem } from "./components/form/select";
import { List } from "./components/list";
import { Body, Footer, Header, Hint, Modal, ModalPropsDispatcher, NewModalController } from "./components/modal";
import { useNotification } from "./components/notification";
import { NewTableController, Table, TableColumn, TablePropsDispatcher } from "./components/table/table";
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
            {({id}) => <Input id={id} name="username" value="admin" />}
        </Label>
        <Label label="旧密码">
            {({id}) => <Input id={id} name="password" type="password" validate={checkPassword} />}
        </Label>
        <Label label="账号类型">
            {
                ({id}) => <Select id={id} name="account">
                    <SelectItem name="系统管理员" value="admin"></SelectItem>
                    <SelectItem name="普通用户" value="user"></SelectItem>
                </Select>
            }
        </Label>
    </Form>
})

define(Footer, () => {
    const context = useIoC()
    const onConfirm = () => {
        const setForm = context.inject(FormPropsDispatcher)
        const formCtl = NewFormController(setForm)
        const formRef = context.inject(FormReference)({})
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
            <Breadcrumb>
                <>主页</>
                <>页面管理</>
                <Link onClick={() => alert("test")}>样例</Link>
            </Breadcrumb>
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
                <TabItem name="abc" title="abc">123</TabItem>
                <TabItem name="def" title="def">456</TabItem>
                <TabItem name="ghi" title="ghi">789</TabItem>
            </Tab>
            <According summary="标题" visible={true}>详情</According>
            <Table data={[{id: 0, name: "张三", age: 35}, {id: 1, name: "李四", age: 28}, {id: 2, name: "王五", age: 40}]}>
                <TableColumn name="id" title="编号" width={10}>
                    {({data}) => <input type="checkbox" name="ids" value={data.id}/>}
                </TableColumn>
                <TableColumn name="name" title="名字" width={40}>
                    {({data}) => data.name}
                </TableColumn>
                <TableColumn name="age" title="年龄" width={20}>
                    {({data}) => data.age}
                </TableColumn>
                <TableColumn name="operation" title="操作" width={20}>
                    {
                        ({rowNum}) => {
                            const setTable = inject(TablePropsDispatcher)
                            const ctl =NewTableController(setTable)
                            return <Button type="danger" onClick={()=> ctl.removeData(rowNum)}>删除</Button>
                        }
                    }
                </TableColumn>
            </Table>
        </div>
    </IoCContext.Provider>);
}
