import { FC, ReactNode } from "react";

interface FooterProps {
    children?: ReactNode
}
 
const Footer: FC<FooterProps> = (props) => {
    return <div className="footer">
        {props.children}
    </div>;
}
 
export default Footer;