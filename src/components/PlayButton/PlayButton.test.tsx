import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { initFantasyCpuState } from '../../FantasyCpu';

import { PlayButton } from './PlayButton';

describe('PlayButton component', () => {
  it('should when the state is finished show a restart button, which when is clicked calls dispatch with restart', () => {
    const dispatchSpy = jest.fn();

    render(
      <PlayButton cpuState="finished" playing={false} dispatch={dispatchSpy} />
    );

    screen.getByText('Restart');

    expect(dispatchSpy).toBeCalledTimes(0);

    userEvent.click(screen.getByRole('button'));

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({ type: 'restart' });
  });

  it('should when the state is playing show a pause button, which when is clicked calls dispatch with pause', () => {
    const dispatchSpy = jest.fn();

    const state = initFantasyCpuState([1, 2, 3]);

    state.playing = true;

    render(
      <PlayButton
        cpuState="executing-instruction"
        playing={true}
        dispatch={dispatchSpy}
      />
    );

    screen.getByText('Pause');

    expect(dispatchSpy).toBeCalledTimes(0);

    userEvent.click(screen.getByRole('button'));

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({ type: 'pause' });
  });

  it('should when the state is paused show a play button, which when is clicked calls dispatch with play', () => {
    const dispatchSpy = jest.fn();

    const state = initFantasyCpuState([1, 2, 3]);

    state.playing = false;

    render(
      <PlayButton
        cpuState="executing-instruction"
        playing={false}
        dispatch={dispatchSpy}
      />
    );

    screen.getByText('Play');

    expect(dispatchSpy).toBeCalledTimes(0);

    userEvent.click(screen.getByRole('button'));

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({ type: 'play' });
  });
});
