import { screen, render } from '@testing-library/react';
import { Block } from './Block';

describe('Block component', () => {
  it('should render the block', () => {
    render(<Block className="some-class">Test</Block>);

    screen.getByText('Test');

    const block = screen.getByTestId('block');
    expect(block.classList.contains('some-class')).toBe(true);
  });
});
