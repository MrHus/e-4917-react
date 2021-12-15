import { useReducer } from 'react';
import { CheatSheet } from './components/CheatSheet/CheatSheet';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { HistoryView } from './components/HistoryView/HistoryView';
import { Memory } from './components/Memory/Memory';
import { PlayButton } from './components/PlayButton/PlayButton';
import { Printer } from './components/Printer/Printer';
import { Registers } from './components/Registers/Registers';
import { ResetButton } from './components/ResetButton/ResetButton';
import { RestoreButton } from './components/RestoreButton/RestoreButton';
import { SaveButton } from './components/SaveButton/SaveButton';
import { SpeedSelect } from './components/SpeedSelect/SpeedSelect';
import { StepButton } from './components/StepButton/StepButton';
import { execute } from './cpu/cpu';
import { Cpu } from './cpu/types';
import { canExecute, initCpuFromMemory } from './cpu/utils';
import { useAutoplay } from './hooks/useAutoplay/useAutoplay';
import { useShowSavingMessage } from './hooks/useShowSavingMessage/useShowSavingMessage';

type Props = {
  initialMemory: number[];
};

export type CpuHistory = Cpu[];

export type FantasyCpuState = {
  cpu: Cpu;
  savePoint: Cpu;
  history: CpuHistory;
  error: boolean;
  playing: boolean;
  speed: number;
};

export type FantasyCpuStateActions =
  | { type: 'pause' }
  | { type: 'play' }
  | { type: 'save' }
  | { type: 'step' }
  | { type: 'setSpeed'; payload: number }
  | { type: 'restore'; payload: Cpu }
  | { type: 'restart' }
  | { type: 'reset'; payload: number[] }
  | { type: 'update'; payload: { text: string; index: number } };

function reducer(
  state: FantasyCpuState,
  action: FantasyCpuStateActions
): FantasyCpuState {
  switch (action.type) {
    case 'pause':
      return { ...state, playing: false };

    case 'play':
      return { ...state, playing: true };

    case 'save':
      return { ...state, savePoint: state.cpu };

    case 'setSpeed':
      return { ...state, speed: action.payload };

    case 'step':
      if (!canExecute(state.cpu)) {
        return { ...state, playing: false };
      }

      const nextState = execute(state.cpu);

      return {
        ...state,
        history: [...state.history, state.cpu],
        cpu: nextState,
        playing: state.playing ? canExecute(nextState) : false,
        error: nextState.state === 'crashed'
      };

    case 'restore':
      return { ...state, cpu: action.payload, playing: false };

    case 'restart':
      return {
        ...state,
        playing: true,
        cpu: {
          ...state.savePoint,
          r0: 0,
          r1: 0,
          ip: 0,
          is: 0,
          state: 'reading-instruction'
        }
      };

    case 'reset':
      return initFantasyCpuState(action.payload);

    case 'update':
      const number = parseInt(action.payload.text, 10);

      if (isNaN(number)) {
        return { ...state, error: true };
      }

      const memory = [...state.cpu.memory];
      memory[action.payload.index] = number;

      const nextCpu = { ...state.cpu, memory };

      return {
        ...state,
        error: false,
        cpu: nextCpu,
        savePoint: nextCpu
      };
  }
}

export function initFantasyCpuState(memory: number[]): FantasyCpuState {
  const cpu = initCpuFromMemory(memory);

  return {
    cpu,
    savePoint: cpu,
    history: [],
    error: false,
    playing: false,
    speed: 200
  };
}

export function FantasyCpu({ initialMemory }: Props) {
  const [state, dispatch] = useReducer(
    reducer,
    initialMemory,
    initFantasyCpuState
  );

  const saving = useShowSavingMessage(state.savePoint);

  useAutoplay(state, dispatch);

  const { cpu } = state;

  return (
    <div className="FantasyCpu p-0 md:p-10">
      <div className="px-2 sm:px-10 py-5 grid gap-4 bg-white md:w-680">
        <Registers cpu={cpu} />

        <Memory cpu={cpu} dispatch={dispatch} />

        <div className="sticky bottom-0 bg-white grid gap-4 py-2">
          <Printer printer={cpu.printer} />

          <HistoryView history={state.history} dispatch={dispatch} />

          <div className="grid xl:grid-cols-6 md:grid-cols-3 gap-4">
            <PlayButton
              playing={state.playing}
              cpuState={cpu.state}
              dispatch={dispatch}
            />

            <SpeedSelect speed={state.speed} dispatch={dispatch} />

            <StepButton dispatch={dispatch} />

            <SaveButton dispatch={dispatch} />

            <RestoreButton savePoint={state.savePoint} dispatch={dispatch} />

            <ResetButton dispatch={dispatch} initialMemory={initialMemory} />
          </div>

          {saving ? <strong>Saved current CPU state</strong> : null}

          {state.error ? <ErrorMessage cpuState={cpu.state} /> : null}
        </div>
      </div>

      <CheatSheet />
    </div>
  );
}
