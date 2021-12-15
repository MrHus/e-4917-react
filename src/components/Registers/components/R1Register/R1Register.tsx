import classNames from 'classnames';
import { instructionInvolvesR1 } from '../../../../cpu/utils';
import { Cpu } from '../../../../cpu/types';
import { CpuRegister } from '../CpuRegister/CpuRegister';

type Props = {
  cpu: Cpu;
};

export function R1Register({ cpu }: Props) {
  const { state, r1, is } = cpu;

  return (
    <CpuRegister
      name="R1"
      value={r1}
      className={classNames({
        'border-yellow-400':
          state === 'executing-instruction' && instructionInvolvesR1(is)
      })}
    />
  );
}
