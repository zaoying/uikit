"use client";

import { Button } from "Com/basic/button";
import { CheckBox } from "Com/form/checkbox";
import { FormPropsDispatcher, FormReference, NewFormController } from "Com/form/form";
import { CheckboxGroup } from "Com/form/group";
import { Body, Header, Modal } from "Com/modal";
import { NewNotifier, NotificationPropsDispatcher } from "Com/notification";
import { Pager } from "Com/pager";
import { Popover, Toggle } from "Com/popover";
import { Table } from "Com/table/table";
import { WithDict } from "Com/with";
import { FC, RefObject, useEffect, useRef } from "react";
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
    deleteUserSucceed: "Delete user succeed!",
    deleteUserFailed: "Delete user failed: ",
    createUser: "Create User",
    createUserSucceed: "Create user succeed!",
    createUserFailed: "Create user failed: ",
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
        deleteUserSucceed: "删除用户成功！",
        deleteUserFailed: "删除用户失败：",
        createUser: "创建用户",
        createUserSucceed: "创建用户成功！",
        createUserFailed: "创建用户失败：",
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

    const refresh = useRef(async () => {})
    const openModal = useRef(() => {})
    const dict = useI18n(UserDict)({})
    const dictRef = useRef(dict)
    useEffect(() => {dictRef.current = dict})
    return (<div>
        <Modal width={360}>{
            ({ ctl, ctx }) => {
                openModal.current = ctl.open
                ctl.onConfirm(() => {
                    const setProps = ctx.inject(NotificationPropsDispatcher)
                    const notifier = NewNotifier(setProps)
                    const setForm = ctx.inject(FormPropsDispatcher)
                    const formCtl = NewFormController(setForm)
                    const formRef: RefObject<HTMLFormElement> = ctx.inject(FormReference)({})
                    if (formRef.current) {
                        const data = NewForm(formRef.current)
                        const user: User = {
                            id: uuidv4(),
                            username: data.getString("username") ?? "",
                            gender: data.getString("gender") == "male" ? "male" : "female",
                            birthDate: data.getDate("birthDate") ?? new Date(),
                            category: data.getString("category") === "admin" ? "admin" : "ordinary",
                            description: data.getString("description")
                        }
                        const callback = async () => {
                            const resp = await userRes.create(user)
                            if (resp.ok) {
                                ctl.close()
                                notifier.info(dictRef.current.createUserSucceed)
                                await refresh.current()
                                return
                            }
                            notifier.error(dictRef.current.createUserFailed + resp.statusText)
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
            ({ ctx, ctl, Column }) => {
                refresh.current = async () => {
                    const users = await userRes.list()
                    ctl.setData(users)
                }
                refresh.current()
                return <WithDict dict={UserDict}>{
                    ({dict}) => {
                    const {columns, gender, category, deleteUserSucceed, deleteUserFailed} = dict({})
                    return <>
                        <CheckboxGroup>{
                            ({allSelected, toggleAll, toggle, init}) => {
                                const all = <CheckBox name="ids" value="*" checked={allSelected} onChange={toggleAll}/>
                                return <Column name="id" title={all} width={5}>{
                                    ({ data }) => <CheckBox name="ids" value={data.id} checked={init(data.id)} onChange={toggle(data.id)}/>
                                }</Column>
                            }
                        }</CheckboxGroup>
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
                                    const setProps = ctx.inject(NotificationPropsDispatcher)
                                    const notifier = NewNotifier(setProps)
                                    const resp = await userRes.delete(data.id)
                                    if (resp.ok) {
                                        notifier.info(deleteUserSucceed)
                                        await refresh.current()
                                        return
                                    }
                                    notifier.error(deleteUserFailed + resp.statusText)
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
