import { ActionCreator } from '@store';
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

export const setCount: ActionCreator<SetCounterAction> = (n: number) => ({
  type: 'SET_COUNT',
  payload: n,
});

export const increaseCount: ActionCreator<IncreaseCounterAction> = () => ({
  type: 'INCREASE_COUNT',
});

// decrease has a delay to test that promises work correctly
export const decreaseCount: ActionCreator<DecreaseCounterAction> = () => ({
  type: 'DECREASE_COUNT',
  payload: new Promise<void>((resolve) => {
    const DELAY = 500;
    setTimeout(resolve, DELAY);
  }),
});
