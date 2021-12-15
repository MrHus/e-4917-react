import { screen, render } from '@testing-library/react';
import { CheatSheet } from './CheatSheet';
import userEvent from '@testing-library/user-event';

describe('CheatScheet component', () => {
  it('should be openened by default and be closable and re-openable', () => {
    render(<CheatSheet />);

    // Check if it is open by default.
    screen.getByText('Cheatsheet');

    // Click the close button
    const closeButton = screen.getByLabelText('close cheatsheet');
    userEvent.click(closeButton);

    // Check if the cheatsheet is no longer open.
    expect(screen.queryByText('Cheatsheet')).toBeNull();

    // Click the open button
    const openButton = screen.getByLabelText('open cheatsheet');
    userEvent.click(openButton);

    // Check if it has re-opened.
    screen.getByText('Cheatsheet');
  });
});
