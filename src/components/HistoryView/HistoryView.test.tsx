import { screen, render } from '@testing-library/react';
import { HistoryView } from './HistoryView';
import userEvent from '@testing-library/user-event';

describe('HistoryView component', () => {
  it('should be closed by default and be openable and closable', () => {
    render(
      <HistoryView
        history={[
          {
            ip: 0,
            is: 1,
            r0: 2,
            r1: 3,
            memory: [1337],
            state: 'executing-instruction',
            printer: [42, 1337]
          }
        ]}
        dispatch={() => undefined}
      />
    );

    // Check if it is closed by default.
    let text = screen.queryByText(`{ ip: 0, is: 1, r0: 2, r1: 3 }`);
    expect(text).toBeNull();

    // Click the open button
    const openButton = screen.getByLabelText('open history');
    userEvent.click(openButton);

    // Check if the history is no longer open.
    screen.getByText(`{ ip: 0, is: 1, r0: 2, r1: 3 }`);

    // Click the open button
    const closeButton = screen.getByLabelText('close history');
    userEvent.click(closeButton);

    // Check if it has re-opened.
    screen.getByText('history');

    text = screen.queryByText(`{ ip: 0, is: 1, r0: 2, r1: 3 }`);
    expect(text).toBeNull();
  });

  it('should render an empty message when the history is empty, and opened', () => {
    render(<HistoryView history={[]} dispatch={() => undefined} />);

    // Click the open button
    const openButton = screen.getByLabelText('open history');
    userEvent.click(openButton);

    screen.getByText(`(No history yet)`);
  });

  it('should not render an empty message when the history is empty, but history is closed', () => {
    render(<HistoryView history={[]} dispatch={() => undefined} />);

    const message = screen.queryByText(`(No history yet)`);
    expect(message).toBeNull();
  });

  it('should call restoreCpuState callback when user clicks on history row', () => {
    const dispatchSpy = jest.fn();

    render(
      <HistoryView
        history={[
          {
            ip: 0,
            is: 1,
            r0: 2,
            r1: 3,
            memory: [1337],
            state: 'executing-instruction',
            printer: [42, 1337]
          }
        ]}
        dispatch={dispatchSpy}
      />
    );

    expect(dispatchSpy).toBeCalledTimes(0);

    const openButton = screen.getByLabelText('open history');
    userEvent.click(openButton);

    const row = screen.getByText(`#0`);
    userEvent.click(row);

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'restore',
      payload: {
        ip: 0,
        is: 1,
        r0: 2,
        r1: 3,
        memory: [1337],
        state: 'executing-instruction',
        printer: [42, 1337]
      }
    });
  });

  it('should render the history rows correctly', () => {
    render(
      <HistoryView
        history={[
          {
            ip: 0,
            is: 1,
            r0: 2,
            r1: 3,
            memory: [100, 200, 300, 400, 500, 600, 700, 800],
            state: 'executing-instruction',
            printer: []
          },
          {
            ip: 4,
            is: 3,
            r0: 2,
            r1: 1,
            memory: [1, 2, 4, 8, 16, 32, 64, 128],
            state: 'executing-instruction',
            printer: []
          }
        ]}
        dispatch={() => undefined}
      />
    );

    const openButton = screen.getByLabelText('open history');
    userEvent.click(openButton);

    screen.getByText(`#0`);
    screen.getByText(`{ ip: 0, is: 1, r0: 2, r1: 3 }`);

    // This is a good-enough approximation
    screen.getByText(/100, 200, 300, 400/);
    screen.getByText(/500, 600, 700, 800/);

    screen.getByText(`#1`);
    screen.getByText(`{ ip: 4, is: 3, r0: 2, r1: 1 }`);

    // This is a good-enough approximations
    screen.getByText(/1, 2, 4, 8/);
    screen.getByText(/16, 32, 64, 128/);
  });
});
