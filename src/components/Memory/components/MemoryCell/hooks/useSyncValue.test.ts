import { renderHook } from '@testing-library/react-hooks';

import { useSyncValue } from './useSyncValue';

describe('useSyncValue hook', () => {
  it('should update the value of the ref when value parameter changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useSyncValue(value),
      {
        initialProps: { value: 0 }
      }
    );

    // First lets test that submitting to an empty ref
    // causes nothing to happen.
    rerender({ value: 42 });
    expect(result.current.current).toBe(null);

    // Now lets create an input and set it on the ref
    const input = document.createElement('input');
    result.current.current = input;

    // Now rerenders with a new value should sync with the
    // value of the input.
    rerender({ value: 1337 });
    expect(input.value).toBe('1337');

    // Test it again just to be sure.
    rerender({ value: 42 });
    expect(input.value).toBe('42');
  });
});
