import { i18n, register } from "~/hooks/i18n"


export const RoomDict = i18n("en-us", () => ({
    checkIn: "Check In",
    name: "Name",
    contact: "Contact",
    next: "Next",
    chooseRoom: "Choose Room",
    roomNumber: "Room Number",
    startDate: "Start Date",
    endDate: "Exit Date",
    previous: "Previous",
    payment: "Payment",
    amount: "Amount",
    paymentMethod: "Payment Method",
    contracts: [
        {code: "master", text: "Master Card"},
        {code: "paypal", text: "Paypal"}
    ],
    checkout: "Checkout"
}))

register("zh-cn", (context) => {
    context.define(RoomDict, () => ({
        checkIn: "登记信息",
        name: "姓名",
        contact: "联系方式",
        next: "下一步",
        chooseRoom: "选择房间",
        roomNumber: "房间号",
        startDate: "开始日期",
        endDate: "结束日期",
        previous: "上一步",
        payment: "付款方式",
        amount: "金额",
        paymentMethod: "支付方式",
        contracts: [
            {code: "alipay", text: "支付宝"},
            {code: "wechat", text: "微信"}
        ],
        checkout: "付款"
    }))
})