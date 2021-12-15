import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { FantasyCpu } from './FantasyCpu';

import './index.css';

ReactDOM.render(
  <StrictMode>
    <FantasyCpu
      initialMemory={[
        // Load 5 into r0
        9, 21,
        // Write to 90 to lock parameter
        11, 90,
        // Load 4 into r1
        10, 22,
        // Write to 91 to lock parameter
        12, 91,
        // Load 14 into r0 as return point
        9, 23,
        // Write return of 16 into 88
        11, 88,
        // Jump into function
        13, 28,
        // Load result
        9, 89,
        // Write to 19 so it is printed
        11, 19,
        // Print result
        8, 0,
        // The values we want to multiply.
        0, 5, 4,
        // The jump back point
        14,

        0, 0, 0, 0,

        // Store registers for restore
        11, 64, 12, 65,
        // Read left into r0 and right into r1
        10, 90, 9, 91,
        // Write result to 68 the counter.
        11, 64,
        // Start loop: load counter
        9, 64,
        // jump to exit routine when final
        14, 54,
        // Load acc into r0
        9, 89,
        // Increment
        1,
        // Write result to acc 89
        11, 89,
        // Load back counter
        9, 64,
        // Decrement counter
        5,
        // Write counter back to cell 64;
        11, 64,
        // restart loop.
        13, 38,
        // Exit routine:
        // Read and write jump back point
        9, 88, 11, 63,
        // Restore r0 and r1
        9, 64, 10, 65,
        // Jump to jumpback point
        13, 0,

        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0
      ]}
    />
  </StrictMode>,
  document.getElementById('root')
);
