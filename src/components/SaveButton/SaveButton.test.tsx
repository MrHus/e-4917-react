import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SaveButton } from './SaveButton';

describe('SaveButton component', () => {
  it('should when the save button is clicked call the dispatch with save', () => {
    const dispatchSpy = jest.fn();

    render(<SaveButton dispatch={dispatchSpy} />);

    screen.getByText('Save');

    expect(dispatchSpy).toBeCalledTimes(0);

    userEvent.click(screen.getByRole('button'));

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({ type: 'save' });
  });
});
