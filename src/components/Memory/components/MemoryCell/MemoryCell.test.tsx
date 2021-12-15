import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryCell } from './MemoryCell';

describe('MemoryCell component', () => {
  it('should when input is focussed call the onFocus callback', () => {
    const onFocusSpy = jest.fn();

    render(
      <MemoryCell
        value={13}
        address={0}
        cpu={{
          ip: 0,
          is: 0,
          r0: 0,
          r1: 0,
          memory: [0],
          state: 'executing-instruction',
          printer: []
        }}
        onFocus={onFocusSpy}
        onChange={() => undefined}
      />
    );

    expect(onFocusSpy).toBeCalledTimes(0);

    const input = screen.getByLabelText('memory-input');
    userEvent.click(input);

    expect(onFocusSpy).toBeCalledTimes(1);
  });

  it('should when user types in input call the onChange callback with the new value', () => {
    const onChangeSpy = jest.fn();

    render(
      <MemoryCell
        value={13}
        address={0}
        cpu={{
          ip: 0,
          is: 0,
          r0: 0,
          r1: 0,
          memory: [0],
          state: 'executing-instruction',
          printer: []
        }}
        onFocus={() => undefined}
        onChange={onChangeSpy}
      />
    );

    expect(onChangeSpy).toBeCalledTimes(0);

    const input = screen.getByLabelText('memory-input');
    userEvent.clear(input);
    userEvent.type(input, '42');

    expect(onChangeSpy).toBeCalledWith('42');
  });

  it('should when value prop changes externally update the input value', () => {
    const onChangeSpy = jest.fn();

    const { rerender } = render(
      <MemoryCell
        value={13}
        address={0}
        cpu={{
          ip: 0,
          is: 0,
          r0: 0,
          r1: 0,
          memory: [0],
          state: 'executing-instruction',
          printer: []
        }}
        onFocus={() => undefined}
        onChange={onChangeSpy}
      />
    );

    rerender(
      <MemoryCell
        value={8}
        address={0}
        cpu={{
          ip: 0,
          is: 0,
          r0: 0,
          r1: 0,
          memory: [0],
          state: 'executing-instruction',
          printer: []
        }}
        onFocus={() => undefined}
        onChange={onChangeSpy}
      />
    );

    const input = screen.getByLabelText<HTMLInputElement>('memory-input');
    expect(input.value).toBe('8');
  });

  describe('the border colors behavior', () => {
    describe('when the Instruction Pointer is the same as the address of the memory cell', () => {
      it('should have a green border when reading an instruction', () => {
        render(
          <MemoryCell
            value={0}
            address={0}
            cpu={{
              ip: 0,
              is: 0,
              r0: 0,
              r1: 0,
              memory: [0],
              state: 'reading-instruction',
              printer: []
            }}
            onFocus={() => undefined}
            onChange={() => undefined}
          />
        );

        const block = screen.getByTestId('block');
        expect(block.classList.contains('border-green-600')).toBe(true);
      });

      it('should have a red border when the program has finished on the memory cell', () => {
        render(
          <MemoryCell
            value={0}
            address={0}
            cpu={{
              ip: 0,
              is: 0,
              r0: 0,
              r1: 0,
              memory: [0],
              state: 'finished',
              printer: []
            }}
            onFocus={() => undefined}
            onChange={() => undefined}
          />
        );

        const block = screen.getByTestId('block');
        expect(block.classList.contains('border-red-600')).toBe(true);
      });

      it('should have a blue border otherwise', () => {
        render(
          <MemoryCell
            value={0}
            address={0}
            cpu={{
              ip: 0,
              is: 0,
              r0: 0,
              r1: 0,
              memory: [0],
              state: 'executing-instruction',
              printer: []
            }}
            onFocus={() => undefined}
            onChange={() => undefined}
          />
        );

        const block = screen.getByTestId('block');
        expect(block.classList.contains('border-blue-600')).toBe(true);
      });
    });

    describe('when the Instruction Pointer not is the same as the address, but memory is used in execution', () => {
      it('should have a light blue border, when the memory cell is used as a parameter, when executing a two byte instruction', () => {
        render(
          <MemoryCell
            value={0}
            address={1}
            cpu={{
              ip: 0,
              is: 8,
              r0: 0,
              r1: 0,
              memory: [8, 7],
              state: 'executing-instruction',
              printer: []
            }}
            onFocus={() => undefined}
            onChange={() => undefined}
          />
        );

        const block = screen.getByTestId('block');
        expect(block.classList.contains('border-blue-400')).toBe(true);
      });

      it('should have a gray border, when the memory cell is a one byte instruction', () => {
        render(
          <MemoryCell
            value={0}
            address={1}
            cpu={{
              ip: 0,
              is: 7,
              r0: 0,
              r1: 0,
              memory: [7, 7],
              state: 'executing-instruction',
              printer: []
            }}
            onFocus={() => undefined}
            onChange={() => undefined}
          />
        );

        const block = screen.getByTestId('block');
        expect(block.classList.contains('border-gray-200')).toBe(true);
      });

      it('should have a gray border, when the memory cell is used as a parameter, when reading a two byte instruction', () => {
        render(
          <MemoryCell
            value={0}
            address={1}
            cpu={{
              ip: 0,
              is: 8,
              r0: 0,
              r1: 0,
              memory: [8, 7],
              state: 'reading-instruction',
              printer: []
            }}
            onFocus={() => undefined}
            onChange={() => undefined}
          />
        );

        const block = screen.getByTestId('block');
        expect(block.classList.contains('border-gray-200')).toBe(true);
      });

      it('should have a yellow border when the memory cell is used as an address for a two byte instruction', () => {
        render(
          <MemoryCell
            value={0}
            address={2}
            cpu={{
              ip: 0,
              is: 13,
              r0: 0,
              r1: 0,
              memory: [13, 2, 0],
              state: 'executing-instruction',
              printer: []
            }}
            onFocus={() => undefined}
            onChange={() => undefined}
          />
        );

        const block = screen.getByTestId('block');
        expect(block.classList.contains('border-yellow-400')).toBe(true);
      });

      it('should not have a yellow border when the memory cell is not used as an address for a two byte instruction', () => {
        render(
          <MemoryCell
            value={0}
            address={2}
            cpu={{
              ip: 0,
              is: 13,
              r0: 0,
              r1: 0,
              memory: [13, 3, 0],
              state: 'executing-instruction',
              printer: []
            }}
            onFocus={() => undefined}
            onChange={() => undefined}
          />
        );

        const block = screen.getByTestId('block');
        expect(block.classList.contains('border-gray-200')).toBe(true);
      });
    });
  });
});
