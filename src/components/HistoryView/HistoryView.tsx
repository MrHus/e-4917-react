import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, Fragment, useState } from 'react';
import { Cpu } from '../../cpu/types';
import { CpuHistory, FantasyCpuStateActions } from '../../FantasyCpu';
import { CpuHeader } from '../UI/CpuHeader/CpuHeader';

type Props = {
  history: CpuHistory;
  dispatch: Dispatch<FantasyCpuStateActions>;
};

export function HistoryView({ history, dispatch }: Props) {
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
  }

  const header = (
    <CpuHeader onClick={toggle}>
      history{' '}
      <FontAwesomeIcon
        icon={open ? faChevronUp : faChevronDown}
        aria-label={open ? 'close history' : 'open history'}
      />
    </CpuHeader>
  );

  if (!open) {
    return header;
  }

  if (history.length === 0) {
    return (
      <>
        {header}
        <div>(No history yet)</div>
      </>
    );
  }

  return (
    <>
      {header}

      <div className="grid gap-4 overflow-y-scroll h-80">
        {history.map((cpu, index) => (
          <div
            key={index}
            onClick={() => dispatch({ type: 'restore', payload: cpu })}
            className="border p-4 cursor-pointer"
            data-testid={`history-${index}`}
          >
            <pre className="inline">{cpuToString(cpu)}</pre>
            <strong className="float-right text-xl">#{index}</strong>{' '}
            <pre>
              [
              {memoryToString(cpu).map((line, index) => (
                <Fragment key={index}>
                  {' '}
                  {line.join(', ')}
                  <br />
                </Fragment>
              ))}
              ]
            </pre>
          </div>
        ))}
      </div>
    </>
  );
}

function cpuToString({ ip, is, r0, r1 }: Cpu): string {
  return `{ ip: ${ip}, is: ${is}, r0: ${r0}, r1: ${r1} }`;
}

function memoryToString({ memory }: Cpu): number[][] {
  const result = [];

  let line = [];

  for (let i = 0; i < memory.length; i++) {
    if (i % 4 === 0) {
      result.push(line);
      line = [];
    }

    const value = memory[i];

    line.push(value);
  }

  result.push(line);

  return result;
}
