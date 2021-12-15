import classNames from 'classnames';
import { Cpu } from '../../../../cpu/types';
import { CpuRegister } from '../CpuRegister/CpuRegister';

type Props = {
  cpu: Cpu;
};

export function ISRegister({ cpu }: Props) {
  const { is, state } = cpu;

  return (
    <CpuRegister
      name="IS"
      value={is}
      className={classNames({
        'border-green-600': state === 'reading-instruction'
      })}
    />
  );
}
