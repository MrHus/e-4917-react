import { screen, render } from '@testing-library/react';
import { IPRegister } from './IPRegister';

describe('IPRegister component', () => {
  it('should render the IP register', () => {
    render(
      <IPRegister
        cpu={{
          ip: 99,
          is: 0,
          r0: 0,
          r1: 0,
          memory: [0],
          state: 'executing-instruction',
          printer: []
        }}
      />
    );

    screen.getByText('IP');
    screen.getByText('99');
  });
});
