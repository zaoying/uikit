import { NewIoCContext } from 'Com/app/hooks/ioc';
import { FC, ReactNode } from 'react';

const {define} = NewIoCContext()

export type LinkProps = {
  href?: string
  children?: ReactNode
}

export const Link: FC<LinkProps> = define((props) => {
  return <a href={props.href}>{props.children}</a>
});