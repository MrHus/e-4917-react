import { screen, render } from '@testing-library/react';
import { Memory } from './Memory';
import userEvent from '@testing-library/user-event';

describe('Memory component', () => {
  it('should render the memory cells', () => {
    render(
      <Memory
        cpu={{
          ip: 0,
          is: 0,
          r0: 0,
          r1: 0,
          memory: [42, 1337, 343],
          state: 'executing-instruction',
          printer: []
        }}
        dispatch={() => undefined}
      />
    );

    screen.getByText('memory');

    screen.getByText('0');
    screen.getByText('1');
    screen.getByText('2');

    screen.getByDisplayValue('42');
    screen.getByDisplayValue('1337');
    screen.getByDisplayValue('343');
  });

  it('should call the dispatch with type pause, when memory cell is focussed', () => {
    const dispatchSpy = jest.fn();

    render(
      <Memory
        cpu={{
          ip: 0,
          is: 0,
          r0: 0,
          r1: 0,
          memory: [0],
          state: 'executing-instruction',
          printer: []
        }}
        dispatch={dispatchSpy}
      />
    );

    expect(dispatchSpy).toBeCalledTimes(0);

    const input = screen.getByLabelText('memory-input');
    userEvent.click(input);

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({ type: 'pause' });
  });

  it('should call dispatch callback with type update, when memory cell is changed', () => {
    const dispatchSpy = jest.fn();

    render(
      <Memory
        cpu={{
          ip: 0,
          is: 0,
          r0: 0,
          r1: 0,
          memory: [0, 0],
          state: 'executing-instruction',
          printer: []
        }}
        dispatch={dispatchSpy}
      />
    );

    expect(dispatchSpy).toBeCalledTimes(0);

    const [first, second] = screen.getAllByLabelText('memory-input');

    userEvent.clear(first);
    userEvent.type(first, '42');

    expect(dispatchSpy).toBeCalledWith({
      type: 'update',
      payload: { text: '42', index: 0 }
    });

    userEvent.clear(second);
    userEvent.type(second, '1337');

    expect(dispatchSpy).toBeCalledWith({
      type: 'update',
      payload: { text: '1337', index: 1 }
    });
  });
});
