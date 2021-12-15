import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch } from 'react';
import { CpuState } from '../../cpu/types';
import { FantasyCpuStateActions } from '../../FantasyCpu';
import { CpuButton } from '../CpuButton/CpuButton';

type Props = {
  cpuState: CpuState;
  playing: boolean;
  dispatch: Dispatch<FantasyCpuStateActions>;
};

export function PlayButton({ cpuState, playing, dispatch }: Props) {
  if (cpuState === 'finished') {
    return (
      <CpuButton onClick={() => dispatch({ type: 'restart' })}>
        <FontAwesomeIcon icon={faPlay} className="mr-2" /> Restart
      </CpuButton>
    );
  } else if (playing) {
    return (
      <CpuButton onClick={() => dispatch({ type: 'pause' })}>
        <FontAwesomeIcon icon={faPause} className="mr-2" /> Pause
      </CpuButton>
    );
  } else {
    return (
      <CpuButton onClick={() => dispatch({ type: 'play' })}>
        <FontAwesomeIcon icon={faPlay} className="mr-2" /> Play
      </CpuButton>
    );
  }
}
