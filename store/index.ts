import { applyMiddleware, createStore } from 'redux';
import { createWrapper, MakeStore } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware, {
  ThunkDispatch as ReduxThunkDispatch,
} from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import reduxInmutableStateInvariant from 'redux-immutable-state-invariant';
import { State } from './model';
import { Action } from './actions';
import { reducer } from './reducers';

export type ThunkDispatch<A extends Action> = ReduxThunkDispatch<
  State,
  null,
  A
>;
export type ActionCreator<A extends Action> = (...args: unknown[]) => A;
export type ThunkActionCreator<
  A extends Action,
  T extends unknown[] = unknown[]
> = (...args: T) => (dispatch: ThunkDispatch<A>, getState: () => State) => void;

const makeStore: MakeStore<State, Action> = (context) => {
  const middleware = [thunkMiddleware, promiseMiddleware];

  if (!IS_PRODUCTION) {
    middleware.unshift(reduxInmutableStateInvariant());
  }

  return createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware))
  );
};

// `wrapper` is required to be named like this
// but the alias `store` is provided as well to make the code clearer
export const wrapper = createWrapper<State>(makeStore, {
  debug: !IS_PRODUCTION,
});

export const store = wrapper;
