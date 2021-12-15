import { Cpu } from '../../../../cpu/types';
import { CpuRegister } from '../CpuRegister/CpuRegister';

type Props = {
  cpu: Cpu;
};

export function IPRegister({ cpu }: Props) {
  const { ip } = cpu;

  return <CpuRegister name="IP" value={ip} className="border-blue-600" />;
}
