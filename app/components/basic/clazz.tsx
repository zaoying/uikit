import { Component } from "react";

export class Button extends Component {
    text: string
    onClick: () => void
    constructor(text: string, onClick: () => void) {
        super({});
        this.text = text;
        this.onClick = onClick;
    }
    render() {
        return <button onClick={this.onClick}>{this.text}</button>;
    }
}

export class IconButton extends Button {
    icon: string
    constructor(icon: string, text: string, onClick: () => void) {
        super(text, onClick);
        this.icon = icon;
    }
    render() {
        return <button onClick={this.onClick}>
            <i>{this.icon}</i>{this.text}
        </button>;
    }
}