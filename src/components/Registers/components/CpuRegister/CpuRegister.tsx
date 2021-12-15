import { Block } from '../../../UI/Block/Block';

type Props = {
  name: string;
  value: number;
  className?: string;
};

export function CpuRegister({ name, value, className }: Props) {
  return (
    <Block className={className}>
      <div className="text-xl text-right font-bold">{name}</div>
      <div data-testid={name} className="text-2xl text-center h-8 -mt-1 mb-2">
        {value}
      </div>
    </Block>
  );
}
