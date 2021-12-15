import classNames from 'classnames';
import { ReactNode } from 'react';

type Props = {
  onClick(): void;
  children: ReactNode;
  className?: string;
};

export function CpuButton({ onClick, children, className = 'mr-2' }: Props) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        `p-2 bg-blue-400 text-white text-xl 
        text-left font-bold shadow hover:bg-blue-500 
        transform duration-200 hover:scale-105
        `,
        className
      )}
    >
      {children}
    </button>
  );
}
