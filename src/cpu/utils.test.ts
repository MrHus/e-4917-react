import {
  canExecute,
  getValueAtNextAddress,
  initCpuFromMemory,
  instructionInvolvesR0,
  instructionInvolvesR1,
  isExecutingTwoByteInstruction,
  isOperation
} from './utils';

describe('initCpuFromMemory util', () => {
  it('should initialize the cpu memory by making a copy', () => {
    const initialMemory = [1, 2, 3];

    const result = initCpuFromMemory(initialMemory);

    expect(result).toEqual({
      ip: 0,
      is: 0,
      r0: 0,
      r1: 0,
      memory: [1, 2, 3],
      state: 'reading-instruction',
      printer: []
    });

    expect(result.memory !== initialMemory).toBe(true);
  });
});

describe('instructionInvolvesR0 util', () => {
  it('should know which instructions involve R0', () => {
    expect(instructionInvolvesR0(0)).toBe(false);
    expect(instructionInvolvesR0(1)).toBe(true);
    expect(instructionInvolvesR0(2)).toBe(true);
    expect(instructionInvolvesR0(3)).toBe(true);
    expect(instructionInvolvesR0(4)).toBe(false);
    expect(instructionInvolvesR0(5)).toBe(true);
    expect(instructionInvolvesR0(6)).toBe(false);
    expect(instructionInvolvesR0(7)).toBe(false);
    expect(instructionInvolvesR0(8)).toBe(false);
    expect(instructionInvolvesR0(9)).toBe(true);
    expect(instructionInvolvesR0(10)).toBe(false);
    expect(instructionInvolvesR0(11)).toBe(true);
    expect(instructionInvolvesR0(12)).toBe(false);
    expect(instructionInvolvesR0(13)).toBe(false);
    expect(instructionInvolvesR0(14)).toBe(true);
    expect(instructionInvolvesR0(15)).toBe(true);
  });
});

describe('instructionInvolvesR1 util', () => {
  it('should know which instructions involve R1', () => {
    expect(instructionInvolvesR1(0)).toBe(false);
    expect(instructionInvolvesR1(1)).toBe(true);
    expect(instructionInvolvesR1(2)).toBe(true);
    expect(instructionInvolvesR1(3)).toBe(false);
    expect(instructionInvolvesR1(4)).toBe(true);
    expect(instructionInvolvesR1(5)).toBe(false);
    expect(instructionInvolvesR1(6)).toBe(true);
    expect(instructionInvolvesR1(7)).toBe(false);
    expect(instructionInvolvesR1(8)).toBe(false);
    expect(instructionInvolvesR1(9)).toBe(false);
    expect(instructionInvolvesR1(10)).toBe(true);
    expect(instructionInvolvesR1(11)).toBe(false);
    expect(instructionInvolvesR1(12)).toBe(true);
    expect(instructionInvolvesR1(13)).toBe(false);
    expect(instructionInvolvesR1(14)).toBe(false);
    expect(instructionInvolvesR1(15)).toBe(false);
  });
});

describe('isOperation util', () => {
  it('should consider the numbers 0 to 15 operations', () => {
    expect(isOperation(0)).toBe(true);
    expect(isOperation(1)).toBe(true);
    expect(isOperation(2)).toBe(true);
    expect(isOperation(3)).toBe(true);
    expect(isOperation(4)).toBe(true);
    expect(isOperation(5)).toBe(true);
    expect(isOperation(6)).toBe(true);
    expect(isOperation(7)).toBe(true);
    expect(isOperation(8)).toBe(true);
    expect(isOperation(9)).toBe(true);
    expect(isOperation(10)).toBe(true);
    expect(isOperation(11)).toBe(true);
    expect(isOperation(12)).toBe(true);
    expect(isOperation(13)).toBe(true);
    expect(isOperation(14)).toBe(true);
    expect(isOperation(15)).toBe(true);
  });

  it('should consider numbers lower than zero non operations', () => {
    expect(isOperation(-1)).toBe(false);
    expect(isOperation(-2)).toBe(false);
    expect(isOperation(-42)).toBe(false);
    expect(isOperation(-1337)).toBe(false);
  });

  it('should consider numbers higher than 15 non operations', () => {
    expect(isOperation(16)).toBe(false);
    expect(isOperation(17)).toBe(false);
    expect(isOperation(42)).toBe(false);
    expect(isOperation(1337)).toBe(false);
  });

  it('should consider null and undefined non operations when memory is accessed beyond the array', () => {
    // @ts-expect-error this is actually known to happen.
    expect(isOperation(null)).toBe(false);

    // @ts-expect-error this is actually known to happen.
    expect(isOperation(undefined)).toBe(false);
  });
});

describe('isExecutingTwoByteInstruction util', () => {
  it('should consider the numbers 8, 9, 10, 11, 12, 13, 14 and 15 two byte instructions', () => {
    expect(isExecutingTwoByteInstruction(0)).toBe(false);
    expect(isExecutingTwoByteInstruction(1)).toBe(false);
    expect(isExecutingTwoByteInstruction(2)).toBe(false);
    expect(isExecutingTwoByteInstruction(3)).toBe(false);
    expect(isExecutingTwoByteInstruction(4)).toBe(false);
    expect(isExecutingTwoByteInstruction(5)).toBe(false);
    expect(isExecutingTwoByteInstruction(6)).toBe(false);
    expect(isExecutingTwoByteInstruction(7)).toBe(false);
    expect(isExecutingTwoByteInstruction(8)).toBe(true);
    expect(isExecutingTwoByteInstruction(9)).toBe(true);
    expect(isExecutingTwoByteInstruction(10)).toBe(true);
    expect(isExecutingTwoByteInstruction(11)).toBe(true);
    expect(isExecutingTwoByteInstruction(12)).toBe(true);
    expect(isExecutingTwoByteInstruction(13)).toBe(true);
    expect(isExecutingTwoByteInstruction(14)).toBe(true);
    expect(isExecutingTwoByteInstruction(15)).toBe(true);
  });
});

describe('getValueAtNextAddress util', () => {
  it('should return the value at the next address, when that address is in bounds of the memory', () => {
    expect(
      getValueAtNextAddress({ ...initCpuFromMemory([100, 200, 300]), ip: 0 })
    ).toBe(200);
    expect(
      getValueAtNextAddress({ ...initCpuFromMemory([100, 200, 300]), ip: 1 })
    ).toBe(300);
  });

  it(`should return zero for the value at the next address, when that address is out of the memory's bounds`, () => {
    expect(
      getValueAtNextAddress({ ...initCpuFromMemory([100, 200, 300]), ip: 2 })
    ).toBe(0);
  });
});

describe('canExecute util', () => {
  it('should only consider all states except "finished" and "crashed" executable', () => {
    expect(canExecute({ ...initCpuFromMemory([]), state: 'crashed' })).toBe(
      false
    );
    expect(canExecute({ ...initCpuFromMemory([]), state: 'finished' })).toBe(
      false
    );
    expect(
      canExecute({ ...initCpuFromMemory([]), state: 'executing-instruction' })
    ).toBe(true);
    expect(
      canExecute({ ...initCpuFromMemory([]), state: 'reading-instruction' })
    ).toBe(true);
  });
});
