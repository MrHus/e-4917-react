import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch } from 'react';
import { Cpu } from '../../cpu/types';
import { FantasyCpuStateActions } from '../../FantasyCpu';
import { CpuButton } from '../CpuButton/CpuButton';

type Props = {
  savePoint: Cpu;
  dispatch: Dispatch<FantasyCpuStateActions>;
};

export function RestoreButton({ savePoint, dispatch }: Props) {
  return (
    <CpuButton
      onClick={() => dispatch({ type: 'restore', payload: savePoint })}
    >
      <FontAwesomeIcon icon={faRedo} className="mr-2" /> Restore
    </CpuButton>
  );
}
