import { FunctionComponent } from "react";

export type IconSize = "small" | "medium" | "large"

interface IconProps {
  icon: string;
  size?: IconSize
}

export const Icon: FunctionComponent<IconProps> = (props) => {
  return (
    <img className={`${props.size ?? "small"} icon`} src={props.icon}/>
  );
};