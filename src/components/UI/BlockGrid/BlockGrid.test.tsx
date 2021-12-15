import { screen, render } from '@testing-library/react';
import { BlockGrid } from './BlockGrid';

describe('BlockGrid component', () => {
  it('should render the block grid', () => {
    render(<BlockGrid>Test</BlockGrid>);

    screen.getByText('Test');
  });
});
