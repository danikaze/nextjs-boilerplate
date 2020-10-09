import { AppAction } from '.';

export type CounterAction =
  | SetCounterAction
  | IncreaseCounterAction
  | DecreaseCounterAction;

export interface SetCounterAction extends AppAction {
  type: 'SET_COUNT';
  payload: number;
}
export interface IncreaseCounterAction extends AppAction {
  type: 'INCREASE_COUNT';
}
export interface DecreaseCounterAction extends AppAction {
  type: 'DECREASE_COUNT';
  payload: Promise<void>;
}

export function setCount(n: number): SetCounterAction {
  return {
    type: 'SET_COUNT',
    payload: n,
  };
}

export function increaseCount(): IncreaseCounterAction {
  return {
    type: 'INCREASE_COUNT',
  };
}

// decrease has a delay to test that promises work correctly
export function decreaseCount(): DecreaseCounterAction {
  return {
    type: 'DECREASE_COUNT',
    payload: new Promise<void>((resolve) => {
      const DELAY = 500;
      setTimeout(resolve, DELAY);
    }),
  };
}
