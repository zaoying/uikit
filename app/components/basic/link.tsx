import { NewIoCContext } from 'Com/app/hooks/ioc';
import { FC, ReactNode } from 'react';

const {define} = NewIoCContext()

export type LinkProps = {
  href?: string
  onClick?: (e: any) => void
  children?: ReactNode
}

export const Link: FC<LinkProps> = define((props) => {
  return <a className="link" href={props.href} onClick={props.onClick}>
    {props.children}
  </a>
});