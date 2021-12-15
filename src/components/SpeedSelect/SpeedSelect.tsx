import { ChangeEvent, Dispatch } from 'react';
import { FantasyCpuStateActions } from '../../FantasyCpu';

type Props = {
  speed: number;
  dispatch: Dispatch<FantasyCpuStateActions>;
};

export function SpeedSelect({ speed, dispatch }: Props) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const payload = parseFloat(event.target.value);
    dispatch({ type: 'setSpeed', payload });
  }

  return (
    <label className="p-2 text-xl text-left font-bold">
      Speed
      <select
        value={speed}
        onChange={handleChange}
        className="ml-2 bg-transparent"
      >
        <option value={1000}>1000</option>
        <option value={500}>500</option>
        <option value={200}>200</option>
        <option value={50}>50</option>
        <option value={1}>1</option>
      </select>
    </label>
  );
}
