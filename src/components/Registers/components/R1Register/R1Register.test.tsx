import { screen, render } from '@testing-library/react';
import { R1Register } from './R1Register';

describe('R1Register component', () => {
  it('should render the R0 register', () => {
    render(
      <R1Register
        cpu={{
          ip: 0,
          is: 0,
          r0: 0,
          r1: 99,
          memory: [0],
          state: 'executing-instruction',
          printer: []
        }}
      />
    );

    screen.getByText('R1');
    screen.getByText('99');
  });

  it('should render the R1 register with a yellow border. when executing instructions, if instruction involves R1', () => {
    render(
      <R1Register
        cpu={{
          ip: 0,
          is: 4,
          r0: 99,
          r1: 0,
          memory: [0],
          state: 'executing-instruction',
          printer: []
        }}
      />
    );

    const block = screen.getByTestId('block');
    expect(block.classList.contains('border-yellow-400')).toBe(true);
  });

  it('should not render the R1 register with a yellow border. when not executing instructions, even if the instruction involves R1', () => {
    render(
      <R1Register
        cpu={{
          ip: 0,
          is: 4,
          r0: 99,
          r1: 0,
          memory: [0],
          state: 'reading-instruction',
          printer: []
        }}
      />
    );

    const block = screen.getByTestId('block');
    expect(block.classList.contains('border-yellow-400')).toBe(false);
  });
});
