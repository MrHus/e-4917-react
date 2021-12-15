import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch } from 'react';
import { FantasyCpuStateActions } from '../../FantasyCpu';
import { CpuButton } from '../CpuButton/CpuButton';

type Props = {
  dispatch: Dispatch<FantasyCpuStateActions>;
};

export function SaveButton({ dispatch }: Props) {
  return (
    <CpuButton onClick={() => dispatch({ type: 'save' })}>
      <FontAwesomeIcon icon={faSave} className="mr-2" /> Save
    </CpuButton>
  );
}
