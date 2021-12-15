import { faStepForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch } from 'react';
import { FantasyCpuStateActions } from '../../FantasyCpu';
import { CpuButton } from '../CpuButton/CpuButton';

type Props = {
  dispatch: Dispatch<FantasyCpuStateActions>;
};

export function StepButton({ dispatch }: Props) {
  return (
    <CpuButton onClick={() => dispatch({ type: 'step' })}>
      <FontAwesomeIcon icon={faStepForward} className="mr-2" /> Step
    </CpuButton>
  );
}
