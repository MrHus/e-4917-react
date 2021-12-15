import { render, screen } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage component', () => {
  it('should the program crashed show the crashed message', () => {
    render(<ErrorMessage cpuState="crashed" />);

    screen.getByText('Program crashed executing unknown instruction!');
  });

  it('should when the program did not crash assume the reason is due to invalid memory', () => {
    render(<ErrorMessage cpuState="reading-instruction" />);

    screen.getByText('Memory contains non numbers!');
  });
});
