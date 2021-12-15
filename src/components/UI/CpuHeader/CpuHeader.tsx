import classNames from 'classnames';
import { MouseEvent, ReactNode } from 'react';

type Props = {
  onClick?(event: MouseEvent<HTMLDivElement>): void;
  children: ReactNode;
};

export function CpuHeader({ children, onClick }: Props) {
  return (
    <div
      className={classNames('font-mono text-xl uppercase', {
        'cursor-pointer': onClick
      })}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
