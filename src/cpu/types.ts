export type CpuState =
  | 'finished'
  | 'reading-instruction'
  | 'executing-instruction'
  | 'crashed';

export type Memory = number[];

export type Printer = number[];

export type Cpu = {
  ip: number;
  is: number;
  r0: number;
  r1: number;
  memory: Memory;
  state: CpuState;
  printer: Printer;
};
