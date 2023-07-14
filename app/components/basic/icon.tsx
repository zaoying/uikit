import { FunctionComponent } from "react";

interface IconProps {
  icon: string;
  width: string;
  height: string;
}

export const Icon: FunctionComponent<IconProps> = (props) => {
  return (
    <img src={props.icon} alt="" width={props.width} height={props.height} />
  );
};

interface IconLink {
  icon: string;
}

export const SmallIcon: FunctionComponent<IconLink> = (props) => {
  return <Icon icon={props.icon} width="24px" height="24px"></Icon>;
};

export const MediumIcon: FunctionComponent<IconLink> = (props) => {
  return <Icon icon={props.icon} width="36px" height="36px"></Icon>;
};

export const LargeIcon: FunctionComponent<IconLink> = (props) => {
  return <Icon icon={props.icon} width="48px" height="48px"></Icon>;
};
