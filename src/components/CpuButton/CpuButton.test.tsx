import { screen, render } from '@testing-library/react';
import { CpuButton } from './CpuButton';
import userEvent from '@testing-library/user-event';

describe('CpuButton component', () => {
  it('should when the button is clicked call the onClick callback', () => {
    const onClickSpy = jest.fn();

    render(<CpuButton onClick={onClickSpy}>Click</CpuButton>);

    expect(onClickSpy).toBeCalledTimes(0);

    const button = screen.getByText('Click');
    userEvent.click(button);

    expect(onClickSpy).toBeCalledTimes(1);
  });

  it('should when no className is set, add a margin-right of 2', () => {
    render(<CpuButton onClick={() => undefined}>Click</CpuButton>);

    const button = screen.getByText('Click');
    expect(button.classList.contains('mr-2')).toBe(true);
  });

  it('should when no className is set, override the margin', () => {
    render(
      <CpuButton className="mx-5" onClick={() => undefined}>
        Click
      </CpuButton>
    );

    const button = screen.getByText('Click');
    expect(button.classList.contains('mx-5')).toBe(true);
  });
});
