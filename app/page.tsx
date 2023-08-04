"use client";

import { According } from "./components/according";
import { Button } from "./components/basic/button";
import { Form } from "./components/form/form";
import { Input } from "./components/form/input";
import { Label } from "./components/form/label";
import { List } from "./components/list";
import { Body, Header, Hint, Modal, ModalController, useModal } from "./components/modal";
import { useNotification } from "./components/notification";
import { Tab, TabItem } from "./components/tabs";
import { useIoC as newIoC } from "./hooks/ioc";

const {define} = newIoC("page")

define(Header, () => <p className="title">修改密码</p>)

define(Hint, () => ({confirm: "确认", cancel: "取消"}))

define(Body, (props) => {
  const checkPassword = (val: string) => {
    if (!val) return "密码不能为空"
    return ""
  }
  return <Form>
      <Label label="用户名" {...props}>
        <Input name="username" value="admin" {...props}/>
      </Label>
      <Label label="旧密码" {...props}>
        <Input name="oldPWD" type="password" validate={checkPassword} {...props}/>
      </Label>
      <Label label="新密码" {...props}>
        <Input name="newPWD" type="password" validate={checkPassword} {...props}/>
      </Label>
      <Label label="重复密码" {...props}>
        <Input name="repeat" type="password" validate={checkPassword} {...props}/>
      </Label>
  </Form>
})

const CustomModal = define(Modal)

const doSomething = (modal: ModalController) => {
  modal.onConfirm(modal.close)
  modal.onCancel(modal.close)
  modal.open()
}

export default function Home() {
  const [dimmer, modal] = useModal(CustomModal)

  const [notification, notifier] = useNotification()

  return (
    <div>
      <p>Icon Button: <Button onClick={() => doSomething(modal)}><span><i>🎨</i>打开模态框</span></Button></p>
      <p>Normal Button: <Button>普通按钮</Button></p>
      {dimmer}
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
      <According summary="标题">详情</According>
    </div>
  );
}
