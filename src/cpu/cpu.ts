import { Cpu } from './types';
import { isOperation, getValueAtNextAddress } from './utils';

type Operation = (cpu: Cpu) => Cpu;

const operations: Record<number, Operation> = {
  0: exit,
  1: addition,
  2: subtraction,
  3: incR0,
  4: incR1,
  5: decR0,
  6: decR1,
  7: beep,
  8: print,
  9: loadIntoR0,
  10: loadIntoR1,
  11: writeFromR0,
  12: writeFromR1,
  13: jump,
  14: jumpIfR0Zero,
  15: jumpIfR0NotZero
};

export function execute(cpu: Cpu): Cpu {
  switch (cpu.state) {
    case 'crashed':
    case 'finished':
      return cpu;

    case 'reading-instruction': {
      const is = cpu.memory[cpu.ip];
      return { ...cpu, is, state: 'executing-instruction' };
    }

    case 'executing-instruction': {
      const is = cpu.is;

      if (!isOperation(is)) {
        return { ...cpu, state: 'crashed' };
      }

      const operation = operations[is];

      const nextState = operation(cpu);

      if (nextState.state !== 'finished') {
        nextState.state = 'reading-instruction';
      }

      return nextState;
    }
  }
}

function exit(cpu: Cpu): Cpu {
  return { ...cpu, is: 0, state: 'finished' };
}

function addition(cpu: Cpu): Cpu {
  const r0 = cpu.r0 + cpu.r1;

  return { ...cpu, is: 1, r0, ip: cpu.ip + 1 };
}

function subtraction(cpu: Cpu): Cpu {
  const r0 = cpu.r0 - cpu.r1;

  return { ...cpu, is: 2, r0, ip: cpu.ip + 1 };
}

function incR0(cpu: Cpu): Cpu {
  const r0 = cpu.r0 + 1;

  return { ...cpu, is: 3, r0, ip: cpu.ip + 1 };
}

function incR1(cpu: Cpu): Cpu {
  const r1 = cpu.r1 + 1;

  return { ...cpu, is: 4, r1, ip: cpu.ip + 1 };
}

function decR0(cpu: Cpu): Cpu {
  const r0 = cpu.r0 - 1;

  return { ...cpu, is: 5, r0, ip: cpu.ip + 1 };
}

function decR1(cpu: Cpu): Cpu {
  const r1 = cpu.r1 - 1;

  return { ...cpu, is: 6, r1, ip: cpu.ip + 1 };
}

function beep(cpu: Cpu): Cpu {
  /* istanbul ignore if */
  if (window.AudioContext) {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    oscillator.frequency.value = 520;
    oscillator.type = 'sine';
    gain.connect(context.destination);
    gain.gain.value = 30 * 0.01;
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 200 * 0.001);
  }

  return { ...cpu, is: 7, ip: cpu.ip + 1 };
}

function print(cpu: Cpu): Cpu {
  const printer = [...cpu.printer, getValueAtNextAddress(cpu)];

  return { ...cpu, is: 8, printer, ip: cpu.ip + 2 };
}

function loadIntoR0(cpu: Cpu): Cpu {
  const address = getValueAtNextAddress(cpu);

  const r0 = cpu.memory[address];

  return { ...cpu, is: 9, r0, ip: cpu.ip + 2 };
}

function loadIntoR1(cpu: Cpu): Cpu {
  const address = getValueAtNextAddress(cpu);

  const r1 = cpu.memory[address];

  return { ...cpu, is: 10, r1, ip: cpu.ip + 2 };
}

function writeFromR0(cpu: Cpu): Cpu {
  const address = getValueAtNextAddress(cpu);

  const memory = [...cpu.memory];
  memory[address] = cpu.r0;

  return { ...cpu, is: 11, memory, ip: cpu.ip + 2 };
}

function writeFromR1(cpu: Cpu): Cpu {
  const address = getValueAtNextAddress(cpu);

  const memory = [...cpu.memory];
  memory[address] = cpu.r1;

  return { ...cpu, is: 12, memory, ip: cpu.ip + 2 };
}

function jump(cpu: Cpu): Cpu {
  const address = getValueAtNextAddress(cpu);

  return { ...cpu, is: 13, ip: address };
}

function jumpIfR0Zero(cpu: Cpu): Cpu {
  if (cpu.r0 === 0) {
    const address = getValueAtNextAddress(cpu);

    return { ...cpu, is: 14, ip: address };
  } else {
    return { ...cpu, is: 14, ip: cpu.ip + 2 };
  }
}

function jumpIfR0NotZero(cpu: Cpu): Cpu {
  if (cpu.r0 !== 0) {
    const address = getValueAtNextAddress(cpu);

    return { ...cpu, is: 15, ip: address };
  } else {
    return { ...cpu, is: 15, ip: cpu.ip + 2 };
  }
}
