"use client";

import { Button } from "./components/basic/button";
import { IconButton } from "./components/basic/iconButton";
import { Body, Hint, Header, Modal, useModal } from "./components/modal/modal";
import { useIoC } from "./hooks/ioc";
import { useNotification } from "./components/notification";

const {define} = useIoC()

define(Header, () => <p className="title">注入成功！</p>)

define(Body, () => <div>我是被注入的内容</div>)

define(Hint, () => ({confirm: "确定", cancel: "取消"}))

const Customized = define(Modal)

export default function Home() {
  const [modal, control] = useModal(Customized)

  const [notification, notifier] = useNotification()
  const doSomething = () => {
    control.onConfirm(control.close)
    control.onCancel(control.close)
    control.open()
  }
  return (
    <div>
      <p>Icon Button: <IconButton onClick={doSomething}></IconButton></p>
      <p>Normal Button: <Button>普通按钮</Button></p>
      {modal}
      <Button onClick={() => notifier.info("info")}>通知</Button>
      <Button onClick={() => notifier.warn("warn")}>警告</Button>
      <Button onClick={() => notifier.error("error")}>错误</Button>
      {notification}
    </div>
  );
}
