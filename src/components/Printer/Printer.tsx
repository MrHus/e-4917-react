import { Printer as CpuPrinter } from '../../cpu/types';
import { CpuHeader } from '../UI/CpuHeader/CpuHeader';

type Props = {
  printer: CpuPrinter;
};

export function Printer({ printer }: Props) {
  return (
    <>
      <CpuHeader>printer</CpuHeader>
      <div className="font-mono">
        {printer.length === 0 ? (
          <div>(Nothing printed yet)</div>
        ) : (
          printer.map((line, index) => (
            <div key={index} data-testid="line">
              {line}
            </div>
          ))
        )}
      </div>
    </>
  );
}
