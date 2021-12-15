import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch } from 'react';
import { FantasyCpuStateActions } from '../../FantasyCpu';
import { CpuButton } from '../CpuButton/CpuButton';

type Props = {
  dispatch: Dispatch<FantasyCpuStateActions>;
  initialMemory: number[];
};

export function ResetButton({ dispatch, initialMemory }: Props) {
  return (
    <CpuButton
      onClick={() => dispatch({ type: 'reset', payload: initialMemory })}
    >
      <FontAwesomeIcon icon={faTrash} className="mr-2" /> Reset
    </CpuButton>
  );
}
