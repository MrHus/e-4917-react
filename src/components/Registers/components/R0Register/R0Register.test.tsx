import { screen, render } from '@testing-library/react';
import { R0Register } from './R0Register';

describe('R0Register component', () => {
  it('should render the R0 register', () => {
    render(
      <R0Register
        cpu={{
          ip: 0,
          is: 0,
          r0: 99,
          r1: 0,
          memory: [0],
          state: 'executing-instruction',
          printer: []
        }}
      />
    );

    screen.getByText('R0');
    screen.getByText('99');
  });

  it('should render the R0 register with a yellow border. when executing instructions, if instruction involves R0', () => {
    render(
      <R0Register
        cpu={{
          ip: 0,
          is: 3,
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

  it('should not render the R0 register with a yellow border. when not executing instructions, even if the instruction involves R0', () => {
    render(
      <R0Register
        cpu={{
          ip: 0,
          is: 3,
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
