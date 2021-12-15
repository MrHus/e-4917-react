import classNames from 'classnames';
import { instructionInvolvesR0 } from '../../../../cpu/utils';
import { Cpu } from '../../../../cpu/types';
import { CpuRegister } from '../CpuRegister/CpuRegister';

type Props = {
  cpu: Cpu;
};

export function R0Register({ cpu }: Props) {
  const { state, is, r0 } = cpu;

  return (
    <CpuRegister
      name="R0"
      value={r0}
      className={classNames({
        'border-yellow-400':
          state === 'executing-instruction' && instructionInvolvesR0(is)
      })}
    />
  );
}
