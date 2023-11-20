"use client";

import { Button } from "Com/basic/button";
import { Form } from "Com/form/form";
import { Input } from "Com/form/input";
import { Label } from "Com/form/label";
import { Select, SelectItem } from "Com/form/select";
import { Stepper, StepperController, StepperItem } from "Com/stepper";
import { useContext } from "react";
import { I18nContext, useI18n } from "~/hooks/i18n";
import { RoomDict } from "./i18n";

function PaymentSelect(props: {id: string}) {
    const dict = useI18n(RoomDict)({})
    const locale = useContext(I18nContext).toString()
    return <Select key={locale} id={props.id} name="payment">
        {
            dict.contracts.map(item => <SelectItem key={item.code} value={item.code}>
                {item.text}
            </SelectItem>)
        }
    </Select>
}

function I18nStepper(props: {ctl: StepperController}) {
    const {ctl} = props
    const dict = useI18n(RoomDict)({})
    return <>
        <StepperItem title={dict.checkIn}>
            <Form>
                <Label label={dict.name}>
                    {({id}) => <Input id={id} name="username"/>}
                </Label>
                <Label label={dict.contact}>
                    {({id}) => <Input id={id} name="contact" type="tel"/>}
                </Label>
                <div className="actions center">
                    <Button type="primary" onClick={ctl.next}>{dict.next}</Button>
                </div>
            </Form>
        </StepperItem>
        <StepperItem title={dict.chooseRoom}>
            <Form>
                <Label label={dict.roomNumber}>
                    {({id}) => <Input id={id} name="room"/>}
                </Label>
                <Label label={dict.startDate}>
                    {({id}) => <Input id={id} name="start" type="date"/>}
                </Label>
                <Label label={dict.endDate}>
                    {({id}) => <Input id={id} name="end" type="date"/>}
                </Label>
                <div className="actions center">
                    <Button type="grey" onClick={ctl.previous}>{dict.previous}</Button>
                    <Button type="primary" onClick={ctl.next}>{dict.next}</Button>
                </div>
            </Form>
        </StepperItem>
        <StepperItem title={dict.payment}>
            <Form>
                <Label label={dict.amount}>
                    {({id}) => <Input id={id} name="amount" readonly value={100}/>}
                </Label>
                <Label label={dict.paymentMethod}>{
                    ({id}) => <PaymentSelect id={id}></PaymentSelect>
                }</Label>
                <div className="actions center">
                    <Button type="grey" onClick={ctl.previous}>{dict.previous}</Button>
                    <Button type="primary">{dict.checkout}</Button>
                </div>
            </Form>
        </StepperItem>
    </>
}

export default function Room() {
    return <div className="glass panel">
        <Stepper>{
            ({ctl}) => <I18nStepper ctl={ctl}></I18nStepper>
        }</Stepper>
    </div>
}