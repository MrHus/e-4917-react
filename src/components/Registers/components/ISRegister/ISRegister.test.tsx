import { screen, render } from '@testing-library/react';
import { ISRegister } from './ISRegister';

describe('ISRegister component', () => {
  it('should render the IS register', () => {
    render(
      <ISRegister
        cpu={{
          ip: 0,
          is: 99,
          r0: 0,
          r1: 0,
          memory: [0],
          state: 'executing-instruction',
          printer: []
        }}
      />
    );

    screen.getByText('IS');
    screen.getByText('99');
  });

  it('should render the IS register with a green border when reading an instruction', () => {
    render(
      <ISRegister
        cpu={{
          ip: 0,
          is: 99,
          r0: 0,
          r1: 0,
          memory: [0],
          state: 'reading-instruction',
          printer: []
        }}
      />
    );

    const block = screen.getByTestId('block');
    expect(block.classList.contains('border-green-600')).toBe(true);
  });
});
