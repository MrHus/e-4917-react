import { Cpu } from '../../cpu/types';
import { BlockGrid } from '../UI/BlockGrid/BlockGrid';
import { CpuHeader } from '../UI/CpuHeader/CpuHeader';

import { IPRegister } from './components/IPRegister/IPRegister';
import { ISRegister } from './components/ISRegister/ISRegister';
import { R0Register } from './components/R0Register/R0Register';
import { R1Register } from './components/R1Register/R1Register';

type Props = {
  cpu: Cpu;
};

export function Registers({ cpu }: Props) {
  return (
    <>
      <CpuHeader>registers</CpuHeader>

      <BlockGrid>
        <IPRegister cpu={cpu} />
        <ISRegister cpu={cpu} />
        <R0Register cpu={cpu} />
        <R1Register cpu={cpu} />
      </BlockGrid>
    </>
  );
}
