import { faList, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useState } from 'react';
import { CpuButton } from '../CpuButton/CpuButton';

export function CheatSheet() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={classNames(
        'fixed bottom-2 right-2 z-30 bg-gray-50 shadow-xl',
        { 'px-2 pt-2': open }
      )}
    >
      {open ? (
        <>
          <div className="flex justify-between">
            <h2 className="text-2xl my-2 font-light">Cheatsheet</h2>
            <FontAwesomeIcon
              aria-label="close cheatsheet"
              icon={faTimesCircle}
              onClick={() => setOpen(false)}
              size="2x"
            />
          </div>

          <ul className="grid gap-4 leading-relaxed text-lg mb-6">
            <li>
              <b>0</b> = stop the program.
            </li>
            <li>
              <b>1</b> = addition (<em>R0</em> = <em>R0</em> + <em>R1</em>)
            </li>
            <li>
              <b>2</b> = subtract (<em>R0</em> = <em>R0</em> – <em>R1</em>)
            </li>
            <li>
              <b>3</b> = increment R0 (<em>R0</em> = <em>R0</em> + 1)
            </li>
            <li>
              <b>4</b> = increment R1 (<em>R1</em> = <em>R1</em> + 1)
            </li>
            <li>
              <b>5</b> = decrement R0 (<em>R0</em> = <em>R0</em> – 1)
            </li>
            <li>
              <b>6</b> = decrement R1 (<em>R1</em> = <em>R1</em> – 1)
            </li>
            <li>
              <b>7</b> = make beeping sound
            </li>
            <li>
              <b>8</b> = print the value of the next memory cell
            </li>
            <li>
              <b>9</b> = load value from <em>address</em> into <em>R0</em>
            </li>
            <li>
              <b>10</b> = load value from <em>address</em> into <em>R1</em>
            </li>
            <li>
              <b>11</b> = write value of <em>R0</em> in <em>address</em>
            </li>
            <li>
              <b>12</b> = write value of <em>R1</em> in <em>address</em>
            </li>
            <li>
              <b>13</b> = jump to <em>address</em>
            </li>
            <li>
              <b>14</b> = jump to <em>address</em> but only if <em>R0</em> == 0
            </li>
            <li>
              <b>15</b> = jump to <em>address</em> but only if <em>R0</em> != 0
            </li>
          </ul>
        </>
      ) : (
        <CpuButton onClick={() => setOpen(true)} className="m-0">
          <FontAwesomeIcon
            icon={faList}
            size="2x"
            aria-label="open cheatsheet"
          />
        </CpuButton>
      )}
    </div>
  );
}
