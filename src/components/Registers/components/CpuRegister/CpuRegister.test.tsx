import { screen, render } from '@testing-library/react';
import { CpuRegister } from './CpuRegister';

describe('CpuRegister component', () => {
  it('should render the cpu register', () => {
    render(<CpuRegister name="1" value={42} className="some-class" />);

    screen.getByText('1');
    screen.getByText('42');

    const block = screen.getByTestId('block');
    expect(block.classList.contains('some-class')).toBe(true);
  });
});
