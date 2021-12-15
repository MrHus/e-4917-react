import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { initCpuFromMemory } from '../../cpu/utils';
import { RestoreButton } from './RestoreButton';

describe('RestoreButton component', () => {
  it('should when the restore button is clicked call the dispatch with restore, with the savepoint as the payload', () => {
    const dispatchSpy = jest.fn();

    const savePoint = initCpuFromMemory([1, 2, 3]);
    render(<RestoreButton savePoint={savePoint} dispatch={dispatchSpy} />);

    screen.getByText('Restore');

    expect(dispatchSpy).toBeCalledTimes(0);

    userEvent.click(screen.getByRole('button'));

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'restore',
      payload: savePoint
    });
  });
});
