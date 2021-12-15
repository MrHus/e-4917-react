import { renderHook } from '@testing-library/react-hooks';
import { initFantasyCpuState } from '../../FantasyCpu';

import { useAutoplay } from './useAutoplay';

describe('useAutoplay hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    jest.spyOn(global, 'clearInterval');
  });

  it('should when playing respect the speed from the state', () => {
    const dispatch = jest.fn();

    const state = initFantasyCpuState([1, 2, 3]);
    state.playing = true;

    const { rerender } = renderHook(
      ({ state }) => useAutoplay(state, dispatch),
      {
        initialProps: { state }
      }
    );

    expect(dispatch).toBeCalledTimes(0);

    jest.advanceTimersByTime(199);
    expect(dispatch).toBeCalledTimes(0);

    jest.advanceTimersByTime(1);
    expect(dispatch).toBeCalledTimes(1);

    jest.advanceTimersByTime(200);
    expect(dispatch).toBeCalledTimes(2);

    state.speed = 50;
    rerender({ state });

    jest.advanceTimersByTime(49);
    expect(dispatch).toBeCalledTimes(2);

    jest.advanceTimersByTime(1);
    expect(dispatch).toBeCalledTimes(3);
  });

  it('should stop playing when the cpu pauses', () => {
    const dispatch = jest.fn();

    const state = initFantasyCpuState([1, 2, 3]);
    state.playing = true;

    const { rerender } = renderHook(
      ({ state }) => useAutoplay(state, dispatch),
      {
        initialProps: { state }
      }
    );

    expect(dispatch).toBeCalledTimes(0);

    jest.advanceTimersByTime(200);
    expect(dispatch).toBeCalledTimes(1);

    state.playing = false;
    rerender({ state });

    jest.advanceTimersByTime(1000);
    expect(dispatch).toBeCalledTimes(1);

    expect(clearInterval).toBeCalledTimes(1);
  });

  it('should stop playing when the cpu crashes', () => {
    const dispatch = jest.fn();

    const state = initFantasyCpuState([1, 2, 3]);
    state.playing = true;

    const { rerender } = renderHook(
      ({ state }) => useAutoplay(state, dispatch),
      {
        initialProps: { state }
      }
    );

    expect(dispatch).toBeCalledTimes(0);

    jest.advanceTimersByTime(200);
    expect(dispatch).toBeCalledTimes(1);

    state.error = true;
    rerender({ state });

    jest.advanceTimersByTime(1000);
    expect(dispatch).toBeCalledTimes(1);

    expect(clearInterval).toBeCalledTimes(1);
  });
});
