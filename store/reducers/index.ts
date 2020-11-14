import { combineReducers, Reducer } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';
import { State } from '@store/model';
import { Action } from '@store/actions';
import { hydrateReducer } from './hydrate';
import { userReducer } from './user';
import { counterReducer } from './counter';

const combinedReducer = combineReducers<State, Action>({
  user: userReducer,
  count: counterReducer,
});

export const reducer: Reducer<State, Action> = (state, action) => {
  if (action.type === HYDRATE) {
    return hydrateReducer(state, action);
  }
  return combinedReducer(state, action as Action);
};
