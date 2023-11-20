import { According } from "Com/according";
import { Button } from "Com/basic/button";
import { Card, CardBody, CardFooter, CardHeader } from "Com/card";
import { Dialog } from "Com/dialog";
import { Dropdown } from "Com/dropdown";
import { Slider, SliderTrack } from "Com/form/slider";
import { Spinner } from "Com/form/spinner";
import { Loader } from "Com/loader";
import { Progress } from "Com/progress";
import { Tab, TabItem } from "Com/tabs";
import { Tooltip } from "Com/tooltip";
import { WithState } from "Com/with";
import { FC } from "react";
import { i18n, register, useI18n } from "./hooks/i18n";
import { Direction } from "./utils/centered";

export const DashboardDict = i18n("en-us", () => ({
    card: "Card",
    loading: "loading",
    dialog: "Dialog",
    content: "Click to close dialog",
    open: "Open Dialog",
    normal: "Normal button",
    chooseDirection: "Please choose direction",
    up: "Up",
    down: "Down",
    left: "Left",
    right: "Right",
    title: "title",
    detail: "detail"
}))
register("zh-cn", (locale) => {
    locale.define(DashboardDict, () => ({
        card: "卡片",
        loading: "加载中",
        dialog: "对话框",
        content: "点击关闭对话框",
        open: "打开对话框",
        normal: "普通按钮",
        chooseDirection: "请选择方向",
        up: "上",
        down: "下",
        left: "左",
        right: "右",
        title: "标题",
        detail: "详情"
    }))
})
 
const Dashboard: FC = () => {
    const dashDict = useI18n(DashboardDict)({})
    return (<div className="dashboard">
        <Card>
            <CardHeader>
                <span title="title">{dashDict.card}</span>
            </CardHeader>
            <CardBody>
                <Loader>{dashDict.loading}</Loader>
                <Progress percentage={40}></Progress>
            </CardBody>
            <CardFooter>
                <Dialog title={dashDict.dialog} content={<p>{dashDict.content}</p>}>
                    <Button>{dashDict.open}</Button>
                </Dialog>
            </CardFooter>
        </Card>
        <div className="glass panel">
            <WithState state={"bottom" as Direction}>{
                ({ state, setState }) => <>
                    <Tooltip message={dashDict.normal} direction={state}>
                        <Button>{dashDict.normal}</Button>
                    </Tooltip>
                    <Dropdown trigger="click">
                        <Button type="grey">
                            {dashDict.chooseDirection}
                            <i className="iconfont icon-arrow-down small"></i>
                        </Button>
                        <a key="top" onClick={() => setState("top")}>{dashDict.up}</a>
                        <a key="bottom" onClick={() => setState("bottom")}>{dashDict.down}</a>
                        <a key="left" onClick={() => setState("left")}>{dashDict.left}</a>
                        <a key="right" onClick={() => setState("right")}>{dashDict.right}</a>
                    </Dropdown>
                </>
            }</WithState>
            <Spinner name="money" min={0} max={100} value={10}></Spinner>
            <Slider name="percentage" min={0} max={100}>{
                (parent) => <>
                    <SliderTrack {...parent} value={20} validatePos={parent.validateLeftPos}></SliderTrack>
                    <SliderTrack {...parent} value={70} validatePos={parent.validateRightPos}></SliderTrack>
                </>
            }</Slider>
        </div>

        <Tab activeTab="abc">
            <TabItem name="abc" title="abc" closeable>123</TabItem>
            <TabItem name="def" title="def" closeable>456</TabItem>
            <TabItem name="ghi" title="ghi" closeable>789</TabItem>
        </Tab>
        <According summary={dashDict.title} visible={true}>{dashDict.detail}</According>
    </div>);
}
 
export default Dashboard;