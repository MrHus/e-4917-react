import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SpeedSelect } from './SpeedSelect';

describe('SpeedSelect component', () => {
  it('should render a select with five options', () => {
    render(<SpeedSelect speed={200} dispatch={() => undefined} />);

    screen.getByText('1000');
    screen.getByText('500');
    screen.getByText('200');
    screen.getByText('50');
    screen.getByText('1');
  });

  it('should by default select the option which matches the value', () => {
    render(<SpeedSelect speed={500} dispatch={() => undefined} />);

    const option500 = screen.getByRole<HTMLOptionElement>('option', {
      name: '500'
    });
    expect(option500.selected).toBe(true);

    const option1000 = screen.getByRole<HTMLOptionElement>('option', {
      name: '1000'
    });
    expect(option1000.selected).toBe(false);
  });

  it('should when an option is selected call the dispatch callback with setSpeed and the selected number as the payload', () => {
    const dispatchSpy = jest.fn();

    render(<SpeedSelect speed={1} dispatch={dispatchSpy} />);

    expect(dispatchSpy).toBeCalledTimes(0);

    userEvent.selectOptions(screen.getByRole('combobox'), ['50']);

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({ type: 'setSpeed', payload: 50 });
  });
});
