import { renderHook, act } from '@testing-library/react-hooks';
import { initCpuFromMemory } from '../../cpu/utils';

import { useShowSavingMessage } from './useShowSavingMessage';

describe('useShowSavingMessage hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    jest.spyOn(global, 'clearTimeout');
  });

  it('should know how to return the saving state', () => {
    const savePoint = initCpuFromMemory([1, 2, 3]);

    const { result, rerender } = renderHook(
      ({ savePoint }) => useShowSavingMessage(savePoint),
      {
        initialProps: { savePoint }
      }
    );

    // Should be false for the initial savePoint.
    expect(result.current).toBe(false);

    // Make a new save point
    rerender({ savePoint: initCpuFromMemory([1, 2, 3]) });

    // show it for 1000 milliseconds
    act(() => {
      jest.advanceTimersByTime(1000);
      expect(result.current).toBe(true);
    });

    // hide it afterwards
    act(() => {
      jest.advanceTimersByTime(1);
      expect(result.current).toBe(false);
    });

    // Should clear the timeout when new savepoints are added rapidly
    rerender({ savePoint: initCpuFromMemory([1, 2, 3]) });
    rerender({ savePoint: initCpuFromMemory([1, 2, 3]) });

    expect(clearTimeout).toBeCalledTimes(2);
  });
});
