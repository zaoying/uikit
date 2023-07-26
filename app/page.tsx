"use client";

import { According } from "./components/according";
import { Button } from "./components/basic/button";
import { Field, Form, FormController, useForm } from "./components/form/form";
import { List } from "./components/list";
import { Body, Header, Hint, Modal, ModalController, useModal } from "./components/modal";
import { useNotification } from "./components/notification";
import { Tab, TabItem, useTab } from "./components/tabs";
import { useIoC as newIoC } from "./hooks/ioc";

const {define} = newIoC()

define(Header, () => <p className="title">请先登录</p>)

define(Hint, () => ({confirm: "登录", cancel: "注册"}))

const CustomForm = define(Form, (props) => {
  return <Form>
      <Field name="username" label="用户名" value="admin"></Field>
      <Field name="password" label="密码" value=""></Field>
  </Form>
})

const CustomModal = define(Modal)
const CustomTab = define(Tab, (props) => {
  return <Tab {...props}>
    <TabItem title="abc">123</TabItem>
    <TabItem title="def">456</TabItem>
  </Tab>
})

const doSomething = (modal: ModalController, form: FormController) => {
  modal.onConfirm(() => {form.submit() && modal.close()})
  modal.onCancel(modal.close)
  modal.open()
}

export default function Home() {
  const [form, ctl] = useForm(CustomForm)
  define(Body, (props) => form)
  const [dimmer, modal] = useModal(CustomModal)

  const [notification, notifier] = useNotification()

  const [holder, tabs] = useTab(CustomTab)
  return (
    <div>
      <p>Icon Button: <Button onClick={() => doSomething(modal, ctl)}><span><i>🎨</i>打开模态框</span></Button></p>
      <p>Normal Button: <Button>普通按钮</Button></p>
      {dimmer}
      <List type="horizontal">
        <Button onClick={() => notifier.info("info")}>通知</Button>
        <Button onClick={() => notifier.warn("warn")}>警告</Button>
        <Button onClick={() => notifier.error("error")}>错误</Button>
      </List>
      {notification}
      {holder}
      <According summary="标题">详情</According>
    </div>
  );
}
