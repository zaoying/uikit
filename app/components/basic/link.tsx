import { FC, ReactNode } from 'react';

export type LinkProps = {
  href?: string
  onClick?: (e: any) => void
  children?: ReactNode
}

export const Link: FC<LinkProps> = (props) => {
  return <a className="link" href={props.href} onClick={props.onClick}>
    {props.children}
  </a>
};