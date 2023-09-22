"use client";

import { Breadcrumb } from "Com/breadcrumb";
import { Wrapper } from "Com/loader";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { i18n, register, useI18n } from "~/hooks/i18n";
import { useInterceptor } from "~/hooks/resource";

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
    const interceptor = useInterceptor()
    return (<div className="user page">
        <Breadcrumb>
            <Link className="link" href="/">{dict.home}</Link>
            <Link className="link" href="/users">{dict.user}</Link>
        </Breadcrumb>
        <Wrapper>{
            (loader) => {
                interceptor.onRequest((req) => {loader.toggle(true); return req})
                interceptor.onResponse((resp) => {loader.toggle(false); return resp})
                interceptor.onError((err) => {loader.toggle(false); return err})
                return props.children
            }
        }</Wrapper>
    </div> );
}
 
export default UserLayout;