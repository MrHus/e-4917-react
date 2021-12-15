import { Cpu } from './types';

export function initCpuFromMemory(memory: number[]): Cpu {
  return {
    ip: 0,
    is: 0,
    r0: 0,
    r1: 0,
    memory: [...memory],
    state: 'reading-instruction',
    printer: []
  };
}

const instructionsInvolvingR0 = [1, 2, 3, 5, 9, 11, 14, 15];
export function instructionInvolvesR0(instruction: number): boolean {
  return instructionsInvolvingR0.includes(instruction);
}

const instructionsInvolvingR1 = [1, 2, 4, 6, 10, 12];
export function instructionInvolvesR1(instruction: number) {
  return instructionsInvolvingR1.includes(instruction);
}

export function isOperation(instruction: number): boolean {
  // Remember that zero is a valid operation but null and undefined
  // are not.
  return !!(
    instruction !== null &&
    instruction !== undefined &&
    instruction >= 0 &&
    instruction <= 15
  );
}

export function isExecutingTwoByteInstruction(is: number): boolean {
  return is >= 8 && is <= 15;
}

export function getValueAtNextAddress(cpu: Cpu): number {
  const nextAddress = cpu.ip + 1;

  if (nextAddress >= cpu.memory.length) {
    return 0;
  } else {
    return cpu.memory[nextAddress];
  }
}

export function canExecute(cpu: Cpu): boolean {
  return cpu.state !== 'finished' && cpu.state !== 'crashed';
}
