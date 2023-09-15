"use client";

import { Button } from "Com/basic/button";
import { FormPropsDispatcher, FormReference, NewFormController } from "Com/form/form";
import { Body, Header, Modal } from "Com/modal";
import { Pager } from "Com/pager";
import { Popover, Toggle } from "Com/popover";
import { Table } from "Com/table/table";
import { WithDict } from "Com/with";
import { FC, RefObject, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { i18n, register, useI18n } from "~/hooks/i18n";
import { useIoC } from "~/hooks/ioc";
import { useResource } from "~/hooks/resource";
import { NewForm } from "~/utils/form";
import { User, UserResourceProvider } from "./api";
import { UserForm } from "./form";
import { useMockForDev } from "./mock";

const UserDict = i18n("en-us", () => ({
    dialog: {
        title: "Danger",
        content: "Want to delete this row ?",
        confirm: "Confirm",
        cancel: "Cancel"
    },
    deleteBtn: "Delete",
    createUser: "Create User",
    addUser: "Add User",
    gender: {
        male: "Male",
        female: "Female"
    },
    category: {
        admin: "Admin",
        ordinary: "Ordinary"
    },
    columns: {
        name: "Name",
        gender: "Gender",
        category: "Category",
        operation: "Operation"
    }
}))

register("zh-cn", (context) => {
    context.define(UserDict, () => ({
        dialog: {
            title: "危险",
            content: "是否删除当前行？",
            confirm: "确认",
            cancel: "取消"
        },
        deleteBtn: "删除",
        createUser: "创建用户",
        addUser: "新增用户",
        gender: {
            male: "男",
            female: "女"
        },
        category: {
            admin: "系统管理员",
            ordinary: "普通用户"
        },
        columns: {
            name: "名字",
            gender: "性别",
            category: "账号类型",
            operation: "操作"
        }
    }))
})

const DeleteConfirm: FC<{ onConfirm: () => void }> = (props) => {
    const dict = useI18n(UserDict)({})
    const content: FC<{ toggle: Toggle }> = ({ toggle }) => (
        <div className="modal" style={{ width: "240px" }}>
            <div className="header"><p className="title">{dict.dialog.title}</p></div>
            <div className="body"><p>{dict.dialog.content}</p></div>
            <div className="footer">
                <Button type="grey" onClick={() => toggle(false)}>{dict.dialog.cancel}</Button>
                <Button type="primary" onClick={() => {
                    props.onConfirm()
                    toggle(false)
                }}>{dict.dialog.confirm}</Button>
            </div>
        </div>)
    return <Popover direction="left" content={content}>
        <Button type="danger">{dict.deleteBtn}</Button>
    </Popover>
}

export default function UserPage() {
    useMockForDev()
    const userRes = useResource(UserResourceProvider)
    const context = useIoC()
    context.define(Header, () => <p className="title">{dict.createUser}</p>)
    context.define(Body, UserForm)

    const refresh = useRef(async () => { })
    const openModal = useRef(() => {})
    const dict = useI18n(UserDict)({})
    return (<div>
        <Modal width={360}>{
            ({ ctl, ctx }) => {
                openModal.current = ctl.open
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
                        const callback = async () => {
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
                return <></>
            }
        }</Modal>
        <div className="right">
            <Button onClick={openModal.current}>{dict.addUser}</Button>
        </div>
        <Table data={new Array<User>()}>{
            ({ ctl, Column }) => {
                refresh.current = async () => {
                    const users = await userRes.list()
                    ctl.setData(users)
                }
                refresh.current()
                return <WithDict dict={UserDict}>{
                    ({dict}) => {
                    const {columns, gender, category} = dict({})
                    return <>
                        <Column name="id" title={<input type="checkbox" name="ids" value="*" />} width={5}>
                            {({ data }) => <input type="checkbox" name="ids" value={data.id} />}
                        </Column>
                        <Column name="name" title={columns.name} width={25}>
                            {({ data }) => data.username}
                        </Column>
                        <Column name="gender" title={columns.gender} width={20}>
                            {({ data }) => data.gender == "male" ? gender.male : gender.female}
                        </Column>
                        <Column name="category" title={columns.category} width={30}>
                            {({ data }) => data.category == "admin" ? category.admin : category.ordinary}
                        </Column>
                        <Column name="operation" title={columns.operation} width={20}>{
                            ({ data }) => {
                                const callback = async () => {
                                    await userRes.delete(data.id)
                                    await refresh.current()
                                }
                                return <DeleteConfirm onConfirm={callback} />
                            }
                        }</Column>
                        <Pager current={3} interval={5} total={10}></Pager>
                    </>}
                }</WithDict>
            }
        }</Table>
    </div>)
}
