import { Button } from "Com/basic/button"
import { Form } from "Com/form/form"
import { Input } from "Com/form/input"
import { Label } from "Com/form/label"
import { Select, SelectItem } from "Com/form/select"
import { Stepper, StepperItem } from "Com/stepper"
import "../globals.css"

export default function Room() {
    return <Stepper>{
        ({ctl}) => <>
            <StepperItem title="登记信息">
                <Form>
                    <Label label="姓名">
                        {({id}) => <Input id={id} name="username"/>}
                    </Label>
                    <Label label="联系方式">
                        {({id}) => <Input id={id} name="contact" type="tel"/>}
                    </Label>
                    <Label label="住址">
                        {({id}) => <Input id={id} name="address" type="tel"/>}
                    </Label>
                    <div className="actions center">
                        <Button type="primary" onClick={ctl.next}>下一步</Button>
                    </div>
                </Form>
            </StepperItem>
            <StepperItem title="选择房间">
                <Form>
                    <Label label="房价号">
                        {({id}) => <Input id={id} name="room"/>}
                    </Label>
                    <Label label="入住日期">
                        {({id}) => <Input id={id} name="start" type="date"/>}
                    </Label>
                    <Label label="退房日期">
                        {({id}) => <Input id={id} name="end" type="date"/>}
                    </Label>
                    <div className="actions center">
                        <Button type="grey" onClick={ctl.previous}>上一步</Button>
                        <Button type="primary" onClick={ctl.next}>下一步</Button>
                    </div>
                </Form>
            </StepperItem>
            <StepperItem title="完成支付">
                <Form>
                    <Label label="房间号">
                        {({id}) => <Input id={id} name="price" readonly value={100}/>}
                    </Label>
                    <Label label="支付方式">{
                        ({id}) => <Select id={id} name="payment">
                            <SelectItem value="alipay">支付宝</SelectItem>
                            <SelectItem value="wechat">微信</SelectItem>
                        </Select>
                    }</Label>
                    <div className="actions center">
                        <Button type="grey" onClick={ctl.previous}>上一步</Button>
                        <Button type="primary">提交</Button>
                    </div>
                </Form>
            </StepperItem>
        </>
    }</Stepper>
}