"use client";

import { FC, useState } from "react";
import { Button } from "./components/basic/button";
import { IconButton } from "./components/basic/iconButton";
import { Body, Footer, Header, Modal } from "./components/modal/modal";
import { useIoC } from "./hooks/ioc";
import { useNotification } from "./components/notification";

const {define, inject} = useIoC()

define(Header, () => <p className="title">注入成功！</p>)

define(Body, () => <div>我是被注入的内容</div>)

const CustomFooter: FC<{onConfirm: () => void, onCancel: () => void}> = (props) => {
    return <div className="two buttons">
        <a className="primary button" onClick={props.onConfirm}>确定</a>
        <a className="grey button" onClick={props.onCancel}>取消</a>
    </div>;
  }

export default function Home() {
  const [visible, toggleVisible] = useState(false)
  const [open, close] = [() => toggleVisible(true), ()=>toggleVisible(false), ]
  define(Footer, () => <CustomFooter onConfirm={close} onCancel={close}></CustomFooter>)
  const modal = inject(Modal)

  const [notification, notifier] = useNotification()
  return (
    <div>
      <p>Icon Button: <IconButton onClick={open}></IconButton></p>
      <p>Normal Button: <Button>普通按钮</Button></p>
      { visible && modal({}) }
      <Button onClick={() => notifier.info("info")}>通知</Button>
      <Button onClick={() => notifier.warn("warn")}>警告</Button>
      <Button onClick={() => notifier.error("error")}>错误</Button>
      {notification}
    </div>
  );
}
