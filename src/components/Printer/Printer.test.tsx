import { screen, render } from '@testing-library/react';
import { Printer } from './Printer';

describe('Printer component', () => {
  it('should when nothing is printed display a message that nothing has printed yet', () => {
    render(<Printer printer={[]} />);

    screen.getByText('printer');
    screen.getByText('(Nothing printed yet)');
  });

  it('should show what is printed when the printer is filled', () => {
    render(<Printer printer={[42, 1337]} />);

    screen.getByText('printer');

    // I want to test that the printer prints in order
    const [first, second] = screen.getAllByTestId('line');

    expect(first.textContent).toBe('42');
    expect(second.textContent).toBe('1337');

    const emptyMessage = screen.queryByText('(Nothing printed yet)');
    expect(emptyMessage).toBeNull();
  });
});
