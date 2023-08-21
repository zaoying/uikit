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
import { Menu } from "./components/menu";
import { Body, Modal, ModalDict } from "./components/modal";
import { useNotification } from "./components/notification";
import { Pager } from "./components/pager";
import { NewTableController, Table, TableColumn, TablePropsDispatcher } from "./components/table/table";
import { Tab, TabItem } from "./components/tabs";
import { Direction, Tooltip } from "./components/tooltip";
import { register } from "./hooks/i18n";
import { IoCContext, NewIoCContext } from "./hooks/ioc";

const { define, inject } = NewIoCContext()

register("zh-cn", (locale) => {
    locale.define(ModalDict, () => ({confirm: "确定", cancel: "取消"}))
})


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
            {({id}) => <Input id={id} name="oldPwd" type="password" validate={checkPassword} />}
        </Label>
        <Label label="新密码">
            {({id}) => <Input id={id} name="newPwd" type="password" validate={checkPassword} />}
        </Label>
        <Label label="重复一遍">
            {({id}) => <Input id={id} name="repeatPwd" type="password" validate={checkPassword} />}
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

export default function Home() {
    const [notification, notifier] = useNotification()
    const [direct, setDirect] = useState<Direction>("bottom")
    return (<IoCContext.Provider value={{ define, inject }}>
        <div>
            <Menu>
                <a className="grey button">个人</a>
                <a>设置</a>
                <a>退出</a>
            </Menu>
            <Breadcrumb>
                <>主页</>
                <>页面管理</>
                <Link onClick={() => alert("test")}>样例</Link>
            </Breadcrumb>
            <div>
                <Modal width={360} title="修改用户资料">
                    {
                        ({ctl, ctx}) => {
                            ctl.onConfirm(() => {
                                const setForm = ctx.inject(FormPropsDispatcher)
                                const formCtl = NewFormController(setForm)
                                const formRef = ctx.inject(FormReference)({})
                                formCtl.validate(formRef);
                                return true
                            })
                            return <Button onClick={ctl.open}>
                                <span><i>🎨</i>打开模态框</span>
                            </Button>
                        }
                    }
                </Modal>
                
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
                <TableColumn name="id" title={<input type="checkbox" name="ids" value="*"/>} width={10}>
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
                <Pager current={3} interval={5} total={10} onChange={(page) => console.info(page)}></Pager>
            </Table>
        </div>
    </IoCContext.Provider>);
}
