"use client";

import { FC, useEffect } from "react";
import { According } from "./components/according";
import { Button } from "./components/basic/button";
import { Link } from "./components/basic/link";
import { Breadcrumb } from "./components/breadcrumb";
import { Card, CardBody, CardFooter, CardHeader } from "./components/card";
import { Dialog } from "./components/dialog";
import { Dropdown } from "./components/dropdown";
import { CheckBox } from "./components/form/checkbox";
import { Form, FormPropsDispatcher, FormReference, InputType, NewFormController } from "./components/form/form";
import { Group } from "./components/form/group";
import { Input } from "./components/form/input";
import { Label } from "./components/form/label";
import { Radio } from "./components/form/radio";
import { Select, SelectItem } from "./components/form/select";
import { Slider, SliderTrack } from "./components/form/slider";
import { Spinner } from "./components/form/spinner";
import { Switch } from "./components/form/switch";
import { Textarea } from "./components/form/textarea";
import { List } from "./components/list";
import { Loader } from "./components/loader";
import { Menu } from "./components/menu";
import { Body, Modal, ModalDict } from "./components/modal";
import { Notification } from "./components/notification";
import { Pager } from "./components/pager";
import { Popover, Toggle } from "./components/popover";
import { Progress } from "./components/progress";
import { Stepper, StepperItem } from "./components/stepper";
import { Table } from "./components/table/table";
import { Tab, TabItem } from "./components/tabs";
import { Tooltip } from "./components/tooltip";
import { WithState } from "./components/with";
import { initLocale, register } from "./hooks/i18n";
import { IoCContext, NewIoCContext } from "./hooks/ioc";
import { Direction } from "./utils/centered";

const { define, inject } = NewIoCContext()

register("zh-cn", (locale) => {
    locale.define(ModalDict, () => ({confirm: "确定", cancel: "取消"}))
})

define(Body, () => {
    const checkPassword = (val: InputType) => {
        if (!val) return "密码不能为空"
        return ""
    }
    const checkPermission = (val: InputType) => {
        if (!val) return "权限不能为空"
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
        <Label label="性别">{
            ({id}) => <Group name="gender">{
                ({name}) => <>
                    <Radio name={name} value="male" checked>男</Radio>
                    <Radio name={name} value="female">女</Radio>
                </>
            }</Group>
        }</Label>
        <Label label="权限">{
            ({id}) => <Group name="permission" validate={checkPermission}>{
                ({name}) => <>
                    <CheckBox name={name} value="user">用户管理</CheckBox>
                    <CheckBox name={name} value="order">订单管理</CheckBox>
                </>
            }</Group>
        }</Label>
        <Label label="记住密码">
            {({id}) => <Switch id={id} name="remember"></Switch>}
        </Label>
        <Label label="自动登录">
            {({id}) => <Switch id={id} name="autoLogin"></Switch>}
        </Label>
        <Label label="账号类型">{
            ({id}) => <Select id={id} name="account">
                <SelectItem value="admin">系统管理员</SelectItem>
                <SelectItem value="user">普通用户</SelectItem>
            </Select>
        }</Label>
        <Label label="描述">
            {({id}) => <Textarea id={id} name="description" placeholder="100字以内" maxLen={100}></Textarea>}
        </Label>
    </Form>
})

export default function Home() {
    useEffect(() => initLocale())
    return (<IoCContext.Provider value={{ define, inject }}>
        <div className="main">
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
                <Modal width={360} title="修改用户资料">{
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
                }</Modal>
                
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
            <Table data={new Array<{id: number, name: string, age: number}>()}>{
                ({ctl, Column}) => {
                    ctl.setData([
                        {id: 0, name: "张三", age: 35}, 
                        {id: 1, name: "李四", age: 28},
                        {id: 2, name: "王五", age: 40}
                    ])
                    return <>
                        <Column name="id" title={<input type="checkbox" name="ids" value="*"/>} width={10}>
                            {({data}) => <input type="checkbox" name="ids" value={data.id}/>}
                        </Column>
                        <Column name="name" title="名字" width={40}>
                            {({data}) => data.name}
                        </Column>
                        <Column name="age" title="年龄" width={20}>
                            {({data}) => data.age}
                        </Column>
                        <Column name="operation" title="操作" width={20}>{
                            ({rowNum}) => {
                                const content: FC<{toggle: Toggle}> = ({toggle}) => (
                                <div className="modal" style={{width: "240px"}}>
                                    <div className="header"><p className="title">危险</p></div>
                                    <div className="body"><p>是否删除当前行？</p></div>
                                    <div className="footer">
                                        <Button type="grey" onClick={() => toggle(false)}>取消</Button>
                                        <Button type="primary" onClick={()=> {
                                            ctl.removeData(rowNum);
                                            toggle(false);
                                        }}>确定</Button>
                                    </div>
                                </div>)
                                return <Popover direction="left" content={content}>
                                    <Button type="danger">删除</Button>
                                </Popover>
                            }
                        }</Column>
                        <Pager current={3} interval={5} total={10}></Pager>
                    </>}
            }</Table>
            <Stepper>{
                ({ctl}) => <>
                    <StepperItem title="登记信息">
                        <Form>
                            <Label label="姓名">
                                {({id}) => <Input id={id} name="username"/>}
                            </Label>
                            <Label label="联系方式">
                                {({id}) => <Input id={id} name="contact" type="tel"/>}
                            </Label>
                            <Label label="住址">
                                {({id}) => <Input id={id} name="address" type="tel"/>}
                            </Label>
                            <div className="actions center">
                                <Button type="primary" onClick={ctl.next}>下一步</Button>
                            </div>
                        </Form>
                    </StepperItem>
                    <StepperItem title="选择房间">
                        <Form>
                            <Label label="房价号">
                                {({id}) => <Input id={id} name="room"/>}
                            </Label>
                            <Label label="入住日期">
                                {({id}) => <Input id={id} name="start" type="date"/>}
                            </Label>
                            <Label label="退房日期">
                                {({id}) => <Input id={id} name="end" type="date"/>}
                            </Label>
                            <div className="actions center">
                                <Button type="grey" onClick={ctl.previous}>上一步</Button>
                                <Button type="primary" onClick={ctl.next}>下一步</Button>
                            </div>
                        </Form>
                    </StepperItem>
                    <StepperItem title="完成支付">
                        <Form>
                            <Label label="房间号">
                                {({id}) => <Input id={id} name="price" readonly value={100}/>}
                            </Label>
                            <Label label="支付方式">{
                                ({id}) => <Select id={id} name="payment">
                                    <SelectItem value="alipay">支付宝</SelectItem>
                                    <SelectItem value="wechat">微信</SelectItem>
                                </Select>
                            }</Label>
                            <div className="actions center">
                                <Button type="grey" onClick={ctl.previous}>上一步</Button>
                                <Button type="primary">提交</Button>
                            </div>
                        </Form>
                    </StepperItem>
                </>
            }</Stepper>
        </div>
    </IoCContext.Provider>);
}
