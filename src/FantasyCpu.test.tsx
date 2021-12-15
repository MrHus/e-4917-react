import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FantasyCpu } from './FantasyCpu';

describe('FantasyCpu component', () => {
  it('should render properly', () => {
    render(<FantasyCpu initialMemory={[8, 1, 8, 2, 8, 3, 8, 0]} />);

    // Check all parts
    screen.getByText('registers');
    screen.getByText('memory');
    screen.getByText('printer');
    screen.getByText('history');

    // Check all buttons to exist
    screen.getByText('Play');
    screen.getByText('Save');
    screen.getByText('Restore');
    screen.getByText('Speed');
    screen.getByText('Step');
    screen.getByText('Reset');

    // Check that no errors are rendered
    const unknownInstruction = screen.queryByText(
      'Program crashed executing unknown instruction!'
    );
    expect(unknownInstruction).toBe(null);

    const memoryContainsUnknownNumbers = screen.queryByText(
      'Memory contains non numbers!'
    );
    expect(memoryContainsUnknownNumbers).toBe(null);

    // Check that the save message is not rendered
    const saveMessage = screen.queryByText('Saved current CPU state');
    expect(saveMessage).toBe(null);
  });

  it('should when an error occurs display the error message', () => {
    render(<FantasyCpu initialMemory={[42]} />);

    const stepButton = screen.getByText('Step');

    // read the faulty instruction.
    userEvent.click(stepButton);

    // After reading the error should not occur yet
    const unknownInstruction = screen.queryByText(
      'Program crashed executing unknown instruction!'
    );
    expect(unknownInstruction).toBe(null);

    // execute the faulty instruction.
    userEvent.click(stepButton);

    screen.getByText('Program crashed executing unknown instruction!');
  });

  it('should know how to save and restore savepoints', async () => {
    expect.assertions(12);

    render(
      <FantasyCpu
        // This program sums 5 + 37 and prints the result 42.
        //              0  1   2   3   4  5   6  7  8  9 10 11  12 13 14 15
        initialMemory={[9, 14, 10, 15, 1, 11, 8, 8, 0, 0, 0, 0, 0, 0, 5, 37]}
      />
    );

    const stepButton = screen.getByText('Step');

    // read and execute the reading 5 into R0
    userEvent.click(stepButton);
    userEvent.click(stepButton);

    // Create a save point at this moment in time
    const saveButton = screen.getByText('Save');
    userEvent.click(saveButton);

    // check if the message shows now
    screen.getByText('Saved current CPU state');

    await playUntilFinished();

    // Assert that the result was printed
    const line = screen.getByTestId('line');
    expect(line.textContent).toBe('42');

    // Assert the state of the registers
    let ip = screen.getByTestId('IP');
    expect(ip.textContent).toBe('9'); // The stop point

    let is = screen.getByTestId('IS');
    expect(is.textContent).toBe('0'); // The last executed instruction

    let r0 = screen.getByTestId('R0');
    expect(r0.textContent).toBe('42'); // Check if 42 because 5 + 37 = 42

    let r1 = screen.getByTestId('R1');
    expect(r1.textContent).toBe('37'); // Check if 37 was loaded

    // Assert that cell 8 now contains the answer 42
    let answer = screen.getByTestId<HTMLInputElement>('memory-8');
    expect(answer.value).toBe('42');

    // Now click restore
    const restoreButton = screen.getByText('Restore');
    userEvent.click(restoreButton);

    // Assert nothing has printed
    const noLine = screen.queryByTestId('line');
    expect(noLine).toBeNull();

    // Assert that the registers have been restored
    ip = screen.getByTestId('IP');
    expect(ip.textContent).toBe('2');

    is = screen.getByTestId('IS');
    expect(is.textContent).toBe('9');

    r0 = screen.getByTestId('R0');
    expect(r0.textContent).toBe('5');

    r1 = screen.getByTestId('R1');
    expect(r1.textContent).toBe('0');

    // Assert that the memory has been restored
    answer = screen.getByTestId<HTMLInputElement>('memory-8');
    expect(answer.value).toBe('0');
  });

  it('should know how restore from history', async () => {
    expect.assertions(12);

    render(
      <FantasyCpu
        // This program sums 5 + 37 and prints the result 42.
        //              0  1   2   3   4  5   6  7  8  9 10 11  12 13 14 15
        initialMemory={[9, 14, 10, 15, 1, 11, 8, 8, 0, 0, 0, 0, 0, 0, 5, 37]}
      />
    );

    await playUntilFinished();

    // Assert that the result was printed
    const line = screen.getByTestId('line');
    expect(line.textContent).toBe('42');

    // Assert the state of the registers
    let ip = screen.getByTestId('IP');
    expect(ip.textContent).toBe('9'); // The stop point

    let is = screen.getByTestId('IS');
    expect(is.textContent).toBe('0'); // The last executed instruction

    let r0 = screen.getByTestId('R0');
    expect(r0.textContent).toBe('42'); // Check if 42 because 5 + 37 = 42

    let r1 = screen.getByTestId('R1');
    expect(r1.textContent).toBe('37'); // Check if 37 was loaded

    // Assert that cell 8 now contains the answer 42
    let answer = screen.getByTestId<HTMLInputElement>('memory-8');
    expect(answer.value).toBe('42');

    // Open up the history for inspection
    const history = screen.getByText('history');
    userEvent.click(history);

    // Now click the second history item, and check if the restore worked.
    const restoreButton = screen.getByTestId('history-2');
    userEvent.click(restoreButton);

    // Assert nothing has printed
    const noLine = screen.queryByTestId('line');
    expect(noLine).toBeNull();

    // Assert that the registers have been restored
    ip = screen.getByTestId('IP');
    expect(ip.textContent).toBe('2');

    is = screen.getByTestId('IS');
    expect(is.textContent).toBe('9');

    r0 = screen.getByTestId('R0');
    expect(r0.textContent).toBe('5');

    r1 = screen.getByTestId('R1');
    expect(r1.textContent).toBe('0');

    // Assert that the memory has been restored
    answer = screen.getByTestId<HTMLInputElement>('memory-8');
    expect(answer.value).toBe('0');
  });

  it('should when the reset button is clicked reset the cpu to the initial memory, and clear the printer', async () => {
    expect.assertions(12);

    render(
      <FantasyCpu
        // This program sums 5 + 37 and prints the result 42.
        //              0  1   2   3   4  5   6  7  8  9 10 11  12 13 14 15
        initialMemory={[9, 14, 10, 15, 1, 11, 8, 8, 0, 0, 0, 0, 0, 0, 5, 37]}
      />
    );

    await playUntilFinished();

    // Assert that the result was printed
    const line = screen.getByTestId('line');
    expect(line.textContent).toBe('42');

    // Assert the state of the registers
    let ip = screen.getByTestId('IP');
    expect(ip.textContent).toBe('9'); // The stop point

    let is = screen.getByTestId('IS');
    expect(is.textContent).toBe('0'); // The last executed instruction

    let r0 = screen.getByTestId('R0');
    expect(r0.textContent).toBe('42'); // Check if 42 because 5 + 37 = 42

    let r1 = screen.getByTestId('R1');
    expect(r1.textContent).toBe('37'); // Check if 37 was loaded

    // Assert that cell 8 now contains the answer 42
    let answer = screen.getByTestId<HTMLInputElement>('memory-8');
    expect(answer.value).toBe('42');

    // Now click Reset
    const resetButton = screen.getByText('Reset');
    userEvent.click(resetButton);

    // Assert nothing has printed
    const noLine = screen.queryByTestId('line');
    expect(noLine).toBeNull();

    // Assert that the registers have been reset
    ip = screen.getByTestId('IP');
    expect(ip.textContent).toBe('0');

    is = screen.getByTestId('IS');
    expect(is.textContent).toBe('0');

    r0 = screen.getByTestId('R0');
    expect(r0.textContent).toBe('0');

    r1 = screen.getByTestId('R1');
    expect(r1.textContent).toBe('0');

    // Assert that the memory has been reset
    answer = screen.getByTestId<HTMLInputElement>('memory-8');
    expect(answer.value).toBe('0');
  });

  it('should when the restart button is pressed restart the program from the savepoint, and start playing again', async () => {
    expect.assertions(13);

    render(
      <FantasyCpu
        // This program sums 5 + 37 and prints the result 42.
        //              0  1   2   3   4  5   6  7  8  9 10 11  12 13 14 15
        initialMemory={[9, 14, 10, 15, 1, 11, 8, 8, 0, 0, 0, 0, 0, 0, 5, 37]}
      />
    );

    await playUntilFinished();

    // Assert that the result was printed
    let line = screen.getByTestId('line');
    expect(line.textContent).toBe('42');

    // Assert the state of the registers
    let ip = screen.getByTestId('IP');
    expect(ip.textContent).toBe('9'); // The stop point

    let is = screen.getByTestId('IS');
    expect(is.textContent).toBe('0'); // The last executed instruction

    let r0 = screen.getByTestId('R0');
    expect(r0.textContent).toBe('42'); // Check if 42 because 5 + 37 = 42

    let r1 = screen.getByTestId('R1');
    expect(r1.textContent).toBe('37'); // Check if 37 was loaded

    // Assert that cell 8 now contains the answer 42
    let answer = screen.getByTestId<HTMLInputElement>('memory-8');
    expect(answer.value).toBe('42');

    // Now click restart
    const restartButton = screen.getByText('Restart');
    userEvent.click(restartButton);

    // Assert nothing has printed
    const noLine = screen.queryByTestId('line');
    expect(noLine).toBeNull();

    // Assert that the registers have been restored
    ip = screen.getByTestId('IP');
    expect(ip.textContent).toBe('0');

    is = screen.getByTestId('IS');
    expect(is.textContent).toBe('0');

    r0 = screen.getByTestId('R0');
    expect(r0.textContent).toBe('0');

    r1 = screen.getByTestId('R1');
    expect(r1.textContent).toBe('0');

    // Assert that the memory has been restored
    answer = screen.getByTestId<HTMLInputElement>('memory-8');
    expect(answer.value).toBe('0');

    // Assert that the program will start playing again
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    });

    // Check that when the program finishes again it has the same result
    line = screen.getByTestId('line');
    expect(line.textContent).toBe('42');
  });

  it('should when the pause button is pressed during play stop the program until the play button is pressed again', () => {
    jest.useFakeTimers();

    render(
      <FantasyCpu
        // This program prints 1, 2, 3
        //              0  1   2   3   4  5
        initialMemory={[8, 1, 8, 2, 8, 3, 0]}
      />
    );

    let playButton = screen.getByText('Play');
    userEvent.click(playButton);

    act(() => {
      jest.advanceTimersByTime(400);
    });

    const line = screen.getByTestId('line');
    expect(line.textContent).toBe('1');

    const pauseButton = screen.getByText('Pause');
    userEvent.click(pauseButton);

    // Nothing should happen even after 10 seconds.
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    const lines = screen.getAllByTestId('line');
    expect(lines.length).toBe(1);

    playButton = screen.getByText('Play');
    userEvent.click(playButton);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    const [first, second, third] = screen.getAllByTestId('line');
    expect(first.textContent).toBe('1');
    expect(second.textContent).toBe('2');
    expect(third.textContent).toBe('3');
  });

  it('should when the speed is toggled speed up the programs execution', () => {
    jest.useFakeTimers();

    render(
      <FantasyCpu
        // This program prints 1, 2, 3
        //              0  1   2   3   4  5
        initialMemory={[8, 1, 8, 2, 8, 3, 0]}
      />
    );

    const speedSelect = screen.getByRole('combobox');
    userEvent.selectOptions(speedSelect, ['50']);

    let playButton = screen.getByText('Play');
    userEvent.click(playButton);

    // Remember an instruction happens in two steps read / execute
    // that is why we must multiply the speed by 2 for an instruction
    // to have finished.
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // After 100 seconds the first print should now appear
    const line = screen.getByTestId('line');
    expect(line.textContent).toBe('1');

    // Speed up the program
    userEvent.selectOptions(speedSelect, ['1']);

    // After 2 seconds the second print should appear
    act(() => {
      jest.advanceTimersByTime(2);
    });

    const [one, two] = screen.getAllByTestId('line');
    expect(one.textContent).toBe('1');
    expect(two.textContent).toBe('2');

    // Slow down up the program
    userEvent.selectOptions(speedSelect, ['1000']);

    // After 2 seconds the last print should appear
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const [first, second, third] = screen.getAllByTestId('line');
    expect(first.textContent).toBe('1');
    expect(second.textContent).toBe('2');
    expect(third.textContent).toBe('3');
  });

  it('should when the user alters the memory change the program / data', () => {
    jest.useFakeTimers();

    render(<FantasyCpu initialMemory={[7, 7, 7]} />);

    let playButton = screen.getByText('Play');
    userEvent.click(playButton);

    const zero = screen.getByTestId<HTMLInputElement>('memory-0');
    userEvent.clear(zero);
    userEvent.type(zero, '8');

    const one = screen.getByTestId<HTMLInputElement>('memory-1');
    userEvent.clear(one);
    userEvent.type(one, '42');

    const two = screen.getByTestId<HTMLInputElement>('memory-2');
    userEvent.clear(two);
    userEvent.type(two, '0');

    // Nothing should happen because the focus paused the execution.
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const noLine = screen.queryByTestId('line');
    expect(noLine).toBeNull();

    playButton = screen.getByText('Play');
    userEvent.click(playButton);

    // Now the program should work
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const line = screen.getByTestId('line');
    expect(line.textContent).toBe('42');
  });

  it('should when the user enters a non number in one of the memory cells crash the program', () => {
    jest.useFakeTimers();

    render(<FantasyCpu initialMemory={[0, 0, 0]} />);

    let playButton = screen.getByText('Play');
    userEvent.click(playButton);

    const zero = screen.getByTestId<HTMLInputElement>('memory-0');
    userEvent.clear(zero);
    userEvent.type(zero, 'aap');

    playButton = screen.getByText('Play');
    userEvent.click(playButton);

    // Trigger the error
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    screen.getByText('Memory contains non numbers!');
  });

  it('should when the step button is clicked step through the program, and append the history', () => {
    jest.useFakeTimers();

    render(<FantasyCpu initialMemory={[8, 42, 0]} />);

    // Open up the history for inspection
    const history = screen.getByText('history');
    userEvent.click(history);

    // Assert that there are no items yet in the history
    expect(screen.queryByTestId('history-0')).toBe(null);
    expect(screen.queryByTestId('history-1')).toBe(null);
    expect(screen.queryByTestId('history-2')).toBe(null);

    // FIRST STEP

    const stepButton = screen.getByText('Step');
    userEvent.click(stepButton);

    // Assert the state of the registers
    let ip = screen.getByTestId('IP');
    expect(ip.textContent).toBe('0');

    let is = screen.getByTestId('IS');
    expect(is.textContent).toBe('8');

    screen.getByTestId('history-0');

    // SECOND STEP

    userEvent.click(stepButton);

    ip = screen.getByTestId('IP');
    expect(ip.textContent).toBe('2');

    is = screen.getByTestId('IS');
    expect(is.textContent).toBe('8');

    screen.getByTestId('history-1');

    // THIRD STEP

    userEvent.click(stepButton);

    ip = screen.getByTestId('IP');
    expect(ip.textContent).toBe('2');

    is = screen.getByTestId('IS');
    expect(is.textContent).toBe('0');

    const line = screen.getByTestId('line');
    expect(line.textContent).toBe('42');

    screen.getByTestId('history-2');

    // FOURTH STEP

    // Check that when clicking a step it does nothing when already finished.
    userEvent.click(stepButton);

    ip = screen.getByTestId('IP');
    expect(ip.textContent).toBe('2');

    is = screen.getByTestId('IS');
    expect(is.textContent).toBe('0');
  });

  async function playUntilFinished() {
    // Speed up the program to the extreme first
    const speedSelect = screen.getByRole('combobox');
    userEvent.selectOptions(speedSelect, ['1']);

    // Now click the play button
    const playButton = screen.getByText('Play');
    userEvent.click(playButton);

    // Waiting for 200 milliseconds should execute 100 steps,
    // which is more than enough
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    });
  }
});
