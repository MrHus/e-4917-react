import { execute } from './cpu';
import { initCpuFromMemory } from './utils';

describe('cpu', () => {
  it('should do nothing when the state is finished', () => {
    const cpu = initCpuFromMemory([1, 2, 3]);
    cpu.state = 'finished';

    expect(execute(cpu)).toBe(cpu);
  });

  it('should do nothing when the state is crashed', () => {
    const cpu = initCpuFromMemory([1, 2, 3]);
    cpu.state = 'crashed';

    expect(execute(cpu)).toBe(cpu);
  });

  it('should when state is reading-instruction set the IS to the value to which the IP points to, and move state to executing-instruction', () => {
    const cpu = initCpuFromMemory([42, 2, 3]);
    cpu.state = 'reading-instruction';

    expect(execute(cpu)).toEqual({
      ip: 0,
      is: 42,
      r0: 0,
      r1: 0,
      memory: [42, 2, 3],
      state: 'executing-instruction',
      printer: []
    });
  });

  describe('executing-instruction state', () => {
    it('should move to state crashed when the instruction is invalid', () => {
      const cpu = initCpuFromMemory([42, 2, 3]);
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 0,
        is: 0,
        r0: 0,
        r1: 0,
        memory: [42, 2, 3],
        state: 'crashed',
        printer: []
      });
    });

    it('should perform the exit instruction when the IS is 0', () => {
      const cpu = initCpuFromMemory([0]);
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 0,
        is: 0,
        r0: 0,
        r1: 0,
        memory: [0],
        state: 'finished',
        printer: []
      });
    });

    it('should perform the addition instruction when the IS is 1', () => {
      const cpu = { ...initCpuFromMemory([1, 0]), r0: 5, r1: 15 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 1,
        is: 1,
        r0: 20,
        r1: 15,
        memory: [1, 0],
        state: 'reading-instruction',
        printer: []
      });
    });

    it('should perform the subtraction instruction when the IS is 2', () => {
      const cpu = { ...initCpuFromMemory([2, 0]), r0: 10, r1: 5 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 1,
        is: 2,
        r0: 5,
        r1: 5,
        memory: [2, 0],
        state: 'reading-instruction',
        printer: []
      });
    });

    it('should perform the incR0 instruction when the IS is 3', () => {
      const cpu = { ...initCpuFromMemory([3, 0]), r0: 0, r1: 0 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 1,
        is: 3,
        r0: 1,
        r1: 0,
        memory: [3, 0],
        state: 'reading-instruction',
        printer: []
      });
    });

    it('should perform the incR1 instruction when the IS is 4', () => {
      const cpu = { ...initCpuFromMemory([4, 0]), r0: 0, r1: 0 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 1,
        is: 4,
        r0: 0,
        r1: 1,
        memory: [4, 0],
        state: 'reading-instruction',
        printer: []
      });
    });

    it('should perform the decR0 instruction when the IS is 5', () => {
      const cpu = { ...initCpuFromMemory([5, 0]), r0: 5, r1: 0 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 1,
        is: 5,
        r0: 4,
        r1: 0,
        memory: [5, 0],
        state: 'reading-instruction',
        printer: []
      });
    });

    it('should perform the decR1 instruction when the IS is 6', () => {
      const cpu = { ...initCpuFromMemory([6, 0]), r0: 0, r1: 5 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 1,
        is: 6,
        r0: 0,
        r1: 4,
        memory: [6, 0],
        state: 'reading-instruction',
        printer: []
      });
    });

    it('should perform the beep instruction when the IS is 7', () => {
      const cpu = { ...initCpuFromMemory([7, 0]), r0: 0, r1: 0 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 1,
        is: 7,
        r0: 0,
        r1: 0,
        memory: [7, 0],
        state: 'reading-instruction',
        printer: []
      });
    });

    it('should perform the print instruction when the IS is 8', () => {
      const cpu = { ...initCpuFromMemory([8, 4, 0]), r0: 0, r1: 0 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 2,
        is: 8,
        r0: 0,
        r1: 0,
        memory: [8, 4, 0],
        state: 'reading-instruction',
        printer: [4]
      });
    });

    it('should perform the loadIntoR0 instruction when the IS is 9', () => {
      const cpu = { ...initCpuFromMemory([9, 3, 0, 5]), r0: 0, r1: 0 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 2,
        is: 9,
        r0: 5,
        r1: 0,
        memory: [9, 3, 0, 5],
        state: 'reading-instruction',
        printer: []
      });
    });

    it('should perform the loadIntoR1 instruction when the IS is 10', () => {
      const cpu = { ...initCpuFromMemory([10, 3, 0, 5]), r0: 0, r1: 0 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 2,
        is: 10,
        r0: 0,
        r1: 5,
        memory: [10, 3, 0, 5],
        state: 'reading-instruction',
        printer: []
      });
    });

    it('should perform the writeFromR0 instruction when the IS is 11', () => {
      const cpu = { ...initCpuFromMemory([11, 3, 0, 0]), r0: 5, r1: 0 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 2,
        is: 11,
        r0: 5,
        r1: 0,
        memory: [11, 3, 0, 5],
        state: 'reading-instruction',
        printer: []
      });
    });

    it('should perform the writeFromR1 instruction when the IS is 12', () => {
      const cpu = { ...initCpuFromMemory([12, 3, 0, 0]), r0: 0, r1: 5 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 2,
        is: 12,
        r0: 0,
        r1: 5,
        memory: [12, 3, 0, 5],
        state: 'reading-instruction',
        printer: []
      });
    });

    it('should perform the jump instruction when the IS is 13', () => {
      const cpu = { ...initCpuFromMemory([13, 5, 0]), r0: 0, r1: 0 };
      cpu.state = 'executing-instruction';

      expect(execute(cpu)).toEqual({
        ip: 5,
        is: 13,
        r0: 0,
        r1: 0,
        memory: [13, 5, 0],
        state: 'reading-instruction',
        printer: []
      });
    });

    describe('jumpIfR0Zero', () => {
      it('should perform the jumpIfR0Zero instruction when the IS is 14, and when R0 is zero', () => {
        const cpu = { ...initCpuFromMemory([14, 5, 0]), r0: 0, r1: 0 };
        cpu.state = 'executing-instruction';

        expect(execute(cpu)).toEqual({
          ip: 5,
          is: 14,
          r0: 0,
          r1: 0,
          memory: [14, 5, 0],
          state: 'reading-instruction',
          printer: []
        });
      });

      it('should not perform the jumpIfR0Zero instruction when the IS is 14, and when R0 is not zero', () => {
        const cpu = { ...initCpuFromMemory([14, 5, 0]), r0: 42, r1: 0 };
        cpu.state = 'executing-instruction';

        expect(execute(cpu)).toEqual({
          ip: 2,
          is: 14,
          r0: 42,
          r1: 0,
          memory: [14, 5, 0],
          state: 'reading-instruction',
          printer: []
        });
      });
    });

    describe('jumpIfR0NotZero', () => {
      it('should perform the jumpIfR0Zero instruction when the IS is 15, and when R0 is not zero', () => {
        const cpu = { ...initCpuFromMemory([15, 5, 0]), r0: 42, r1: 0 };
        cpu.state = 'executing-instruction';

        expect(execute(cpu)).toEqual({
          ip: 5,
          is: 15,
          r0: 42,
          r1: 0,
          memory: [15, 5, 0],
          state: 'reading-instruction',
          printer: []
        });
      });

      it('should not perform the jumpIfR0Zero instruction when the IS is 15, and when R0 is zero', () => {
        const cpu = { ...initCpuFromMemory([15, 5, 0]), r0: 0, r1: 0 };
        cpu.state = 'executing-instruction';

        expect(execute(cpu)).toEqual({
          ip: 2,
          is: 15,
          r0: 0,
          r1: 0,
          memory: [15, 5, 0],
          state: 'reading-instruction',
          printer: []
        });
      });
    });
  });
});
