import { CheckBox } from "Com/form/checkbox"
import { Form, InputType } from "Com/form/form"
import { Group } from "Com/form/group"
import { Input } from "Com/form/input"
import { Label } from "Com/form/label"
import { Radio } from "Com/form/radio"
import { Select, SelectItem } from "Com/form/select"
import { Textarea } from "Com/form/textarea"

export const UserForm = () => {
    const checkEmpty = (label: string) => (val: InputType) => {
        if (!val) return label + "不能为空"
        return ""
    }
    return <Form action="">
        <Label label="用户名">
            {({id}) => <Input id={id} name="username" validate={checkEmpty("用户名")}/>}
        </Label>
        <Label label="出生日期">
            {({id}) => <Input id={id} name="birthDate" type="date" validate={checkEmpty("出生日期")}/>}
        </Label>
        <Label label="性别">{
            ({id}) => <Group name="gender">{
                ({name}) => <>
                    <Radio name={name} value="male" checked>男</Radio>
                    <Radio name={name} value="female">女</Radio>
                </>
            }</Group>
        }</Label>
        <Label label="权限">{
            ({id}) => <Group name="permission" validate={checkEmpty("权限")}>{
                ({name}) => <>
                    <CheckBox name={name} value="users">用户管理</CheckBox>
                    <CheckBox name={name} value="rooms">订单管理</CheckBox>
                </>
            }</Group>
        }</Label>
        <Label label="账号类型">{
            ({id}) => <Select id={id} name="category" label="普通用户" value="admin">
                <SelectItem value="admin">系统管理员</SelectItem>
                <SelectItem value="ordinary">普通用户</SelectItem>
            </Select>
        }</Label>
        <Label label="描述">
            {({id}) => <Textarea id={id} name="description" placeholder="100字以内" maxLen={100}></Textarea>}
        </Label>
    </Form>
}