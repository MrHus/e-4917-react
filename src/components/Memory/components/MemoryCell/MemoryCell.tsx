import { Cpu } from '../../../../cpu/types';
import {
  getValueAtNextAddress,
  isExecutingTwoByteInstruction
} from '../../../../cpu/utils';
import { Block } from '../../../UI/Block/Block';
import { useSyncValue } from './hooks/useSyncValue';

type Props = {
  value: number;
  address: number;
  cpu: Cpu;
  onChange(value: string): void;
  onFocus(): void;
};
export function MemoryCell({ value, address, cpu, onChange, onFocus }: Props) {
  const inputEl = useSyncValue(value);

  return (
    <Block className={calculateColor(address, cpu)}>
      <div className="text-sm text-right italic">{address}</div>
      <div className="flex justify-center">
        <input
          ref={inputEl}
          className="
            text-2xl text-center 
            h-8 w-16 mb-2 
            bg-transparent
          "
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          defaultValue={value}
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label="memory-input"
          data-testid={`memory-${address}`}
        />
      </div>
    </Block>
  );
}

function calculateColor(address: number, cpu: Cpu): string {
  // When the instruction pointer is on this address
  if (cpu.ip === address) {
    if (cpu.state === 'reading-instruction') {
      return 'border-green-600';
    } else if (cpu.state === 'finished') {
      return 'border-red-600';
    } else {
      return 'border-blue-600';
    }
  } else if (
    cpu.state === 'executing-instruction' &&
    isExecutingTwoByteInstruction(cpu.is)
  ) {
    // If the next instruction is on this address
    if (cpu.ip + 1 === address) {
      return 'border-blue-400';
    } else {
      const value = getValueAtNextAddress(cpu);

      // When used in a two byte instruction, and this address,
      // is the argument to that instruction, color it yellow.
      if (address === value) {
        return 'border-yellow-400';
      }
    }
  }

  return 'border-gray-200';
}
