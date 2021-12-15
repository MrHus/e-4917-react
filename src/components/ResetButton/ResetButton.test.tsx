import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResetButton } from './ResetButton';

describe('ResetButton component', () => {
  it('should when the reset button is clicked call the dispatch with reset, and with the initial memory as payload', () => {
    const dispatchSpy = jest.fn();

    render(<ResetButton dispatch={dispatchSpy} initialMemory={[42, 1337]} />);

    screen.getByText('Reset');

    expect(dispatchSpy).toBeCalledTimes(0);

    userEvent.click(screen.getByRole('button'));

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({ type: 'reset', payload: [42, 1337] });
  });
});
