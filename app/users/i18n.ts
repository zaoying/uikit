import { i18n, register } from "~/hooks/i18n"

export const UserDict = i18n("en-us", () => ({
    dialog: {
        title: "Danger",
        deleteOne: "Want to delete current row?",
        multiDelete: "Want to delete all selected rows?",
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
    refresh: "Refresh",
    updateBtn: "Update",
    updateUser: "Update User",
    updateUserSucceed: "Update user succeed!",
    updateUserFailed: "Update user failed: ",
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
            deleteOne: "是否删除当前行？",
            multiDelete: "是否删除全部选中的行？",
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
        refresh: "刷新",
        updateBtn: "编辑",
        updateUser: "编辑用户",
        updateUserSucceed: "修改用户成功！",
        updateUserFailed: "修改用户失败: ",
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