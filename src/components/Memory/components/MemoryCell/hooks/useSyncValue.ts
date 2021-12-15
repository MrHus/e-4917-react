import { MutableRefObject, useEffect, useRef } from 'react';

export function useSyncValue(
  value: number
): MutableRefObject<HTMLInputElement | null> {
  const inputEl = useRef<HTMLInputElement | null>(null);

  useEffect(
    function syncValue() {
      if (inputEl.current) {
        inputEl.current.value = `${value}`;
      }
    },
    [value]
  );

  return inputEl;
}
