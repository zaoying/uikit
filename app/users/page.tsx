"use client";

import { Button } from "Com/basic/button";
import { FormPropsDispatcher, FormReference, NewFormController } from "Com/form/form";
import { Body, Modal } from "Com/modal";
import { Pager } from "Com/pager";
import { Popover, Toggle } from "Com/popover";
import { Table } from "Com/table/table";
import { FC, RefObject, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useIoC } from "~/hooks/ioc";
import { useResource } from "~/hooks/resource";
import { NewForm } from "~/utils/form";
import "../globals.css";
import { User, UserResourceProvider } from "./api";
import { UserForm } from "./form";
import { useMockForDev } from "./mock";

const DeleteConfirm: FC<{onConfirm: () => void}> = (props) => {
    const content: FC<{ toggle: Toggle }> = ({ toggle }) => (
        <div className="modal" style={{ width: "240px" }}>
            <div className="header"><p className="title">危险</p></div>
            <div className="body"><p>是否删除当前行？</p></div>
            <div className="footer">
                <Button type="grey" onClick={() => toggle(false)}>取消</Button>
                <Button type="primary" onClick={() => {
                    props.onConfirm()
                    toggle(false)
                }}>确定</Button>
            </div>
        </div>)
    return <Popover direction="left" content={content}>
        <Button type="danger">删除</Button>
    </Popover>
}

export default function UserPage() {
    useMockForDev()
    const userRes = useResource(UserResourceProvider)
    const context = useIoC()
    context.define(Body, UserForm)
    
    const refresh = useRef(async ()=> {})
    return (<div>
        <div className="right">
            <Modal width={360} title="创建用户">{
                ({ctl, ctx}) => {
                    ctl.onConfirm(() => {
                        const setForm = ctx.inject(FormPropsDispatcher)
                        const formCtl = NewFormController(setForm)
                        const formRef: RefObject<HTMLFormElement> = ctx.inject(FormReference)({})
                        if (formRef.current) {
                            const data = NewForm(formRef.current)
                            const user: User = {
                                id: uuidv4(),
                                username: data.getString("username") ?? "",
                                gender: data.getString("gender") == "male" ? "male" : "females",
                                birthDate: data.getDate("birthDate") ?? new Date(),
                                category: data.getString("category") === "admin" ? "admin" : "ordinary",
                                description: data.getString("description")
                            }
                            const callback = async ()=> {
                                const resp = await userRes.create(user)
                                resp.ok && ctl.close()
                                refresh.current()
                            }
                            formCtl.validate(formRef, callback);
                        }
                        return true
                    })
                    ctl.onCancel(() => {
                        const setForm = ctx.inject(FormPropsDispatcher)
                        const formCtl = NewFormController(setForm)
                        formCtl.reset()
                        return false
                    })
                    return <Button onClick={ctl.open}>创建用户</Button>
                }
            }</Modal>
        </div>
        <Table data={new Array<User>()}>{
            ({ ctl, Column }) => {
                refresh.current = async ()=> {
                    const users = await userRes.list()
                    ctl.setData(users)
                }
                refresh.current()
                return <>
                    <Column name="id" title={<input type="checkbox" name="ids" value="*" />} width={10}>
                        {({ data }) => <input type="checkbox" name="ids" value={data.id} />}
                    </Column>
                    <Column name="name" title="名字" width={20}>
                        {({ data }) => data.username}
                    </Column>
                    <Column name="gender" title="性别" width={20}>
                        {({ data }) => data.gender}
                    </Column>
                    <Column name="category" title="账号类型" width={30}>
                        {({ data }) => data.category}
                    </Column>
                    <Column name="operation" title="操作" width={20}>{
                        ({ data }) => {
                            const callback = async ()=> {
                                await userRes.delete(data.id)
                                await refresh.current()
                            }
                            return <DeleteConfirm onConfirm={callback}/>
                        }
                    }</Column>
                    <Pager current={3} interval={5} total={10}></Pager>
                </>
            }
        }</Table>
    </div>)
}
