import { CpuState } from '../../cpu/types';

type Props = {
  cpuState: CpuState;
};

export function ErrorMessage({ cpuState }: Props) {
  return (
    <strong className="text-xl text-red-600">
      {cpuState === 'crashed'
        ? 'Program crashed executing unknown instruction!'
        : 'Memory contains non numbers!'}
    </strong>
  );
}
