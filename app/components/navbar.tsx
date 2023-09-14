import { FC, ReactNode } from "react";

interface NavbarProps {
    children?: ReactNode
}
 
const Navbar: FC<NavbarProps> = (props) => {
    return <div className="navbar">
        {props.children}
    </div>;
}
 
export default Navbar;