import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function BlockGrid({ children }: Props) {
  return <div className="grid grid-cols-4 gap-2">{children}</div>;
}
