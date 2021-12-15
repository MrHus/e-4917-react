import { useEffect, Dispatch } from 'react';
import { FantasyCpuState, FantasyCpuStateActions } from '../../FantasyCpu';

export function useAutoplay(
  state: FantasyCpuState,
  dispatch: Dispatch<FantasyCpuStateActions>
) {
  useEffect(
    function autoPlay() {
      if (!state.playing || state.error) {
        return;
      }

      // Do a step every second
      const timeoutId = setInterval(() => {
        dispatch({ type: 'step' });
      }, state.speed);

      return () => {
        clearInterval(timeoutId);
      };
    },
    [dispatch, state.playing, state.speed, state.error]
  );
}
