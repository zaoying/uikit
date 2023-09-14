"use client";

import { Breadcrumb } from "Com/breadcrumb";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { i18n, register, useI18n } from "~/hooks/i18n";

export const UserLayoutDict = i18n("en-us", () => ({
    home: "Home",
    user: "User Management"
}))

register("zh-cn", (context) => {
    context.define(UserLayoutDict, () => ({
        home: "主页",
        user: "用户管理"
    }))
})

interface UserLayoutProps {
    children: ReactNode
}
 
const UserLayout: FC<UserLayoutProps> = (props) => {
    const dict = useI18n(UserLayoutDict)({})
    return ( <div className="user page">
        <Breadcrumb>
            <Link className="link" href="/">{dict.home}</Link>
            <Link className="link" href="/users">{dict.user}</Link>
        </Breadcrumb>
        {props.children}
    </div> );
}
 
export default UserLayout;