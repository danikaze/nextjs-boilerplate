import { Reducer } from 'redux';
import { Action } from '@store/actions';
import { UserState } from '@store/model/user';

export const userReducer: Reducer<UserState, Action> = (
  state = null,
  action
) => {
  if (action.type === 'SET_USER') {
    return action.payload;
  }

  return state;
};
