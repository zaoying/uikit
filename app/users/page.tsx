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
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useI18n } from "~/hooks/i18n";
import { useIoC } from "~/hooks/ioc";
import { useResource } from "~/hooks/resource";
import { NewForm } from "~/utils/form";
import { User, UserResourceProvider } from "./api";
import { UserForm } from "./form";
import { UserDict } from "./i18n";
import { useMockForDev } from "./mock";

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

const emptyUser: User = {
    id: "",
    username: "",
    gender: "male",
    birthDate: new Date(),
    category: "ordinary",
}

export default function UserPage() {
    useMockForDev()
    const [defaultUser, setDefaultUser] = useState<User>(emptyUser)
    const userRes = useResource(UserResourceProvider)
    const context = useIoC()
    context.define(Header, () => <p className="title">
        {defaultUser.id ? dict.updateUser : dict.createUser}
    </p>)
    context.define(Body, () => <UserForm {...defaultUser}></UserForm>)

    const refresh = useRef(async () => {})
    const openModal = useRef(() => {})
    const createUser = () => {
        setDefaultUser(emptyUser)
        openModal.current()
    }
    const updateUser = (user: User) => {
        setDefaultUser(user)
        openModal.current()
    }
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
                            id: data.getString("id") ?? "",
                            username: data.getString("username") ?? "",
                            gender: data.getString("gender") == "male" ? "male" : "female",
                            birthDate: data.getDate("birthDate") ?? new Date(),
                            category: data.getString("category") === "admin" ? "admin" : "ordinary",
                            description: data.getString("description")
                        }
                        const callback = async () => {
                            const tip = dictRef.current
                            const userId = user.id
                            if (!userId) {
                                user.id = uuidv4()
                            }
                            const resp = await (userId ? userRes.update(user.id, user) : userRes.create(user))
                            if (resp.ok) {
                                ctl.close()
                                const succeedTip = userId ? tip.updateUserSucceed : tip.createUserSucceed
                                notifier.info(succeedTip)
                                await refresh.current()
                                return
                            }
                            const failedTip = userId ? tip.updateUserFailed : tip.createUserFailed
                            notifier.error(failedTip + resp.statusText)
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
            <Button onClick={createUser}>{dict.addUser}</Button>
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
                                return <>
                                    <DeleteConfirm onConfirm={callback} />
                                    <Button type="second" onClick={()=>updateUser(data)}>
                                        {dictRef.current.updateBtn}
                                    </Button>
                                </>
                            }
                        }</Column>
                        <Pager current={3} interval={5} total={10}></Pager>
                    </>}
                }</WithDict>
            }
        }</Table>
    </div>)
}
