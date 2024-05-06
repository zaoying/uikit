import { CheckBox } from "Com/form/checkbox"
import { Form, FormPropsDispatcher, FormReference, InputType, NewFormController } from "Com/form/form"
import { Group } from "Com/form/group"
import { Input } from "Com/form/input"
import { Label } from "Com/form/label"
import { Radio } from "Com/form/radio"
import { Select, SelectItem } from "Com/form/select"
import { Textarea } from "Com/form/textarea"
import { Body, Header, Modal } from "Com/modal"
import { NewNotifier, NotificationPropsDispatcher } from "Com/notification"
import { FC, MutableRefObject, RefObject, useEffect, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { useI18n } from "~/hooks/i18n"
import { useIoC } from "~/hooks/ioc"
import { yyyyMMdd } from "~/utils/date"
import { NewForm } from "~/utils/form"
import { User, UserResource } from "./api"
import { UserDict, UserFormDict } from "./i18n"

export type UserModalProps = {
    openModal: MutableRefObject<() => void>
    userRes: UserResource
    refresh: MutableRefObject<() => Promise<void>>
    user: User
}

export const UserModal: FC<UserModalProps> = (props) => {
    const {openModal, userRes, refresh, user} = props
    const context = useIoC()
    context.define(Header, () => <p className="title">
        {user.id ? dict.updateUser : dict.createUser}
    </p>)
    context.define(Body, () => <UserForm {...user}></UserForm>)
    const dict = useI18n(UserDict)({})
    const dictRef = useRef(dict)
    useEffect(() => {dictRef.current = dict})
    return <Modal width={360} className="user modal">{
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
}

export const UserForm = (user: User) => {
    const dict = useI18n(UserFormDict)({})
    const checkEmpty = (label: string) => (val: InputType) => {
        return val ? "" : label + " " + dict.notEmpty
    }
    let birthDate = user.birthDate.toLocaleDateString("zh-cn", yyyyMMdd)
    birthDate = birthDate.replaceAll("/", "-")
    const category = user.category == "admin" ? dict.category.admin : dict.category.ordinary
    return <Form action="">
        <input name="id" value={user.id} type="hidden"/>
        <Label label={dict.username}>
            {({id}) => <Input id={id} name="username" value={user.username} 
                validate={checkEmpty(dict.username)}/>}
        </Label>
        <Label label={dict.birthDate}>
            {({id}) => <Input id={id} name="birthDate" type="date" value={birthDate}
                validate={checkEmpty(dict.birthDate)}/>}
        </Label>
        <Label label={dict.gender.name}>{
            () => <Group name="gender">{
                ({name}) => <>
                    <Radio name={name} value="male" checked={user.gender == "male"}>
                        {dict.gender.male}
                    </Radio>
                    <Radio name={name} value="female" checked={user.gender == "female"}>
                        {dict.gender.female}
                    </Radio>
                </>
            }</Group>
        }</Label>
        <Label label={dict.permission.name}>{
            () => <Group name="permission" validate={checkEmpty(dict.permission.name)}>{
                ({name, onChange}) => <>
                    <CheckBox name={name} value="users" onChange={onChange}>{dict.permission.user}</CheckBox>
                    <CheckBox name={name} value="rooms" onChange={onChange}>{dict.permission.room}</CheckBox>
                </>
            }</Group>
        }</Label>
        <Label label={dict.category.name}>{
            ({id}) => <Select id={id} name="category" label={category} value={user.category}>
                <SelectItem value="admin">{dict.category.admin}</SelectItem>
                <SelectItem value="ordinary">{dict.category.ordinary}</SelectItem>
            </Select>
        }</Label>
        <Label label={dict.description.name}>{
            ({id}) => (
                <Textarea id={id} name="description" value={user.description}
                    placeholder={dict.description.placeholder} maxLen={100}/>
            )
        }</Label>
    </Form>
}