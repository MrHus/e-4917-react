import { screen, render } from '@testing-library/react';
import { Registers } from './Registers';

describe('Registers component', () => {
  it('should render all of the cpu registers', () => {
    render(
      <Registers
        cpu={{
          ip: 1,
          is: 2,
          r0: 3,
          r1: 4,
          memory: [42, 1337, 343],
          state: 'executing-instruction',
          printer: []
        }}
      />
    );

    screen.getByText('registers');

    screen.getByText('IP');
    screen.getByText('1');

    screen.getByText('IS');
    screen.getByText('2');

    screen.getByText('R0');
    screen.getByText('3');

    screen.getByText('R1');
    screen.getByText('4');
  });
});
