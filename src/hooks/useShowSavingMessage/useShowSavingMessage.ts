import { useEffect, useRef, useState } from 'react';
import { Cpu } from '../../cpu/types';

export function useShowSavingMessage(savePoint: Cpu): boolean {
  const [saving, setSaving] = useState(false);

  const firstTime = useRef(true);

  useEffect(() => {
    if (firstTime.current) {
      firstTime.current = false;
      return;
    }

    setSaving(true);

    const timeoutId = setTimeout(() => {
      setSaving(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [savePoint]);

  return saving;
}
