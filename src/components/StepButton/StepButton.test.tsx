import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StepButton } from './StepButton';

describe('StepButton component', () => {
  it('should when the step button is clicked call the dispatch with step', () => {
    const dispatchSpy = jest.fn();

    render(<StepButton dispatch={dispatchSpy} />);

    screen.getByText('Step');

    expect(dispatchSpy).toBeCalledTimes(0);

    userEvent.click(screen.getByRole('button'));

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({ type: 'step' });
  });
});
