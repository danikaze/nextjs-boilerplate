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
import { UserAuthData } from '@model/user';

export type ThunkDispatch<A extends Action> = ReduxThunkDispatch<
  State,
  null,
  A
>;
// tslint:disable-next-line: no-any
export type ActionCreator<A extends Action> = (...args: any[]) => A;
// tslint:disable-next-line: no-any
export type ThunkActionCreator<A extends Action, T extends any[] = any[]> = (
  ...args: T
) => (dispatch: ThunkDispatch<A>, getState: () => State) => void;

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

const w = createWrapper<State, Action>(makeStore, {
  debug: !IS_PRODUCTION,
});

type Gssp = typeof w['getServerSideProps'];
type Ctx = Parameters<Parameters<Gssp>[0]>[0];
type Store = Omit<typeof w, 'getServerSideProps'> & {
  // tslint:disable-next-line:no-any
  getServerSideProps: <P extends {} = any>(
    callback: (
      ctx: Ctx & {
        req: { user: UserAuthData | false };
      }
    ) => void | P
  ) => ReturnType<Gssp>;
};

// `wrapper` is required to be named like this
// but the alias `store` is provided as well to make the code clearer
export const wrapper = w as Store;
export const store = w as Store;
