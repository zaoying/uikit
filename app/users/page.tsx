"use client";

import { Button } from "Com/basic/button";
import { CheckBox } from "Com/form/checkbox";
import { CheckboxGroup } from "Com/form/group";
import { NewNotifier, NotificationPropsDispatcher } from "Com/notification";
import { Pager } from "Com/pager";
import { Popover, Toggle } from "Com/popover";
import { Table } from "Com/table/table";
import { WithDict } from "Com/with";
import { FC, useEffect, useRef, useState } from "react";
import { useI18n } from "~/hooks/i18n";
import { useIoC } from "~/hooks/ioc";
import { useResource } from "~/hooks/resource";
import { User, UserResourceProvider } from "./api";
import { UserModal } from "./form";
import { UserDict } from "./i18n";
import { useMockForDev } from "./mock";

type DeleteConfirmProps = {
    ids: string[]
    onConfirm: (ids: string[]) => void,
    multiDelete?: boolean
}

const DeleteConfirm: FC<DeleteConfirmProps> = (props) => {
    const dict = useI18n(UserDict)({})
    const hint = props.multiDelete ? dict.dialog.multiDelete : dict.dialog.deleteOne
    const content: FC<{ toggle: Toggle }> = ({ toggle }) => (
        <div className="modal" style={{ minWidth: "180px" }}>
            <div className="header"><p className="title">{dict.dialog.title}</p></div>
            <div className="center body"><p>{hint}</p></div>
            <div className="center footer">
                <Button type="grey" onClick={() => toggle(false)}>{dict.dialog.cancel}</Button>
                <Button type="primary" onClick={() => {
                    props.onConfirm(props.ids)
                    toggle(false)
                }}>{dict.dialog.confirm}</Button>
            </div>
        </div>)
    return <Popover direction="left" content={content}>
        <Button type="danger" disabled={props.ids.length == 0}>{dict.deleteBtn}</Button>
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
    const context = useIoC()
    const setProps = context.inject(NotificationPropsDispatcher)
    const notifier = NewNotifier(setProps)

    const dict = useI18n(UserDict)({})
    const dictRef = useRef(dict)
    useEffect(() => {dictRef.current = dict})

    useMockForDev()
    const [defaultUser, setDefaultUser] = useState<User>(emptyUser)
    const userRes = useResource(UserResourceProvider)

    const [selected, setSelected] = useState<string[]>([])
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
    const deleteUser = async (id: string) => {
        const resp = await userRes.delete(id)
        if (resp.ok) {
            notifier.info(dictRef.current.deleteUserSucceed)
            return
        }
        notifier.error(dictRef.current.deleteUserFailed + resp.statusText)
    }
    const multipleDelete = async (ids: string[]) => {
        await Promise.all(ids.map((id) => deleteUser(id)))
        await refresh.current()
    }
    return (<div>
        <UserModal openModal={openModal} userRes={userRes} refresh={refresh} user={defaultUser}/>
        <ul className="list right">
            <Button onClick={createUser}>{dict.addUser}</Button>
            <DeleteConfirm ids={selected} multiDelete onConfirm={multipleDelete} />
            <Button type="grey" onClick={refresh.current}>
                <i className="iconfont small icon-refresh"></i>
            </Button>
        </ul>
        <Table data={new Array<User>()}>{
            ({ ctl, Column }) => {
                userRes.list().then(users => ctl.setData(users))
                return <WithDict dict={UserDict}>{
                    ({dict}) => {
                    const {columns, gender, category} = dict({})
                    return <>
                        <CheckboxGroup onChange={setSelected}>{
                            ({allSelected, toggleAll, toggle, init, reset}) => {
                                refresh.current = async () => {
                                    const users = await userRes.list()
                                    ctl.setData(users)
                                    reset()
                                }
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
                                return <>
                                    <DeleteConfirm ids={[data.id]} onConfirm={multipleDelete} />
                                    <Button type="second" onClick={() => updateUser(data)}>
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
