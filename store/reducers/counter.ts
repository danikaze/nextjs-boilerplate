import { Reducer } from 'redux';
import { isFulfilledAction } from '@utils/redux-promise-actions';
import { Action } from '@store/actions';
import { CounterState } from '@store/model/counter';

const defaultState: CounterState = {
  data: 0,
};

export const counterReducer: Reducer<CounterState, Action> = (
  state = defaultState,
  action
) => {
  if (action.type === 'SET_COUNT') {
    return {
      data: action.payload,
    };
  }

  if (action.type === 'INCREASE_COUNT') {
    return {
      data: state.data + 1,
    };
    /*
     * When TypeScript 4.1.0 comes out, it should be possible to compare with
     * `action.type === 'DECREASE_COUNT_FULFILLED'`
     * thanks fo Template literal types
     */
  }

  if (isFulfilledAction(action, 'DECREASE_COUNT')) {
    return {
      data: state.data - 1,
    };
  }

  return state;
};
