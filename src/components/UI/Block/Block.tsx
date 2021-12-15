import classNames from 'classnames';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export function Block({ children, className }: Props) {
  return (
    <div
      data-testid="block"
      className={classNames('border-4 p-2 font-mono', className)}
    >
      {children}
    </div>
  );
}
