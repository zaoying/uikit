import { CheckBox } from "Com/form/checkbox"
import { Form, InputType } from "Com/form/form"
import { Group } from "Com/form/group"
import { Input } from "Com/form/input"
import { Label } from "Com/form/label"
import { Radio } from "Com/form/radio"
import { Select, SelectItem } from "Com/form/select"
import { Textarea } from "Com/form/textarea"
import { i18n, register, useI18n } from "~/hooks/i18n"
import { yyyyMMdd } from "~/utils/date"
import { User } from "./api"

export const UserFormDict = i18n("en-us", () => ({
    notEmpty: "can not be empty.",
    username: "Username",
    birthDate: "Birth date",
    gender: {
        name: "Gender",
        male: "Male",
        female: "Female"
    },
    permission: {
        name: "Permission",
        user: "User Management",
        room: "Room Management"
    },
    category: {
        name: "Category",
        admin: "Admin",
        ordinary: "Ordinary"
    },
    description: {
        name: "Description",
        placeholder: "less then 100 letters."
    }
}))

register("zh-cn", (context) => {
    context.define(UserFormDict, () => ({
        notEmpty: "不能为空",
        username: "用户名称",
        birthDate: "出生日期",
        gender: {
            name: "性别",
            male: "男",
            female: "女"
        },
        permission: {
            name: "权限",
            user: "用户管理",
            room: "房间管理"
        },
        category: {
            name: "账号类型",
            admin: "系统管理员",
            ordinary: "普通用户"
        },
        description: {
            name: "描述",
            placeholder: "不超过100字"
        }
    }))
})

export const UserForm = (user: User) => {
    const dict = useI18n(UserFormDict)({})
    const checkEmpty = (label: string) => (val: InputType) => {
        if (!val) return label + " " + dict.notEmpty
        return ""
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
                ({name}) => <>
                    <CheckBox name={name} value="users">{dict.permission.user}</CheckBox>
                    <CheckBox name={name} value="rooms">{dict.permission.room}</CheckBox>
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