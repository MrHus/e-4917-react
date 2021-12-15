import { Dispatch } from 'react';
import { Cpu } from '../../cpu/types';
import { FantasyCpuStateActions } from '../../FantasyCpu';
import { BlockGrid } from '../UI/BlockGrid/BlockGrid';
import { CpuHeader } from '../UI/CpuHeader/CpuHeader';
import { MemoryCell } from './components/MemoryCell/MemoryCell';

type Props = {
  cpu: Cpu;
  dispatch: Dispatch<FantasyCpuStateActions>;
};

export function Memory({ cpu, dispatch }: Props) {
  return (
    <>
      <CpuHeader>memory</CpuHeader>

      <BlockGrid>
        {cpu.memory.map((value, index) => (
          <MemoryCell
            key={index}
            value={value}
            address={index}
            cpu={cpu}
            onFocus={() => dispatch({ type: 'pause' })}
            onChange={(text) =>
              dispatch({ type: 'update', payload: { text, index } })
            }
          />
        ))}
      </BlockGrid>
    </>
  );
}
