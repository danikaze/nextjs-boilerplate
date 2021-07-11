import { GetStaticProps, NextComponentType, NextPageContext } from 'next';
import { createWrapper, MakeStore } from 'next-redux-wrapper';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware, {
  ThunkDispatch as ReduxThunkDispatch,
} from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import reduxInmutableStateInvariant from 'redux-immutable-state-invariant';
import { GetServerSideProps } from '@_app';
import { State } from './model';
import { Action } from './actions';
import { reducer } from './reducers';

// tslint:disable: no-any
export type ThunkDispatch<A extends Action> = ReduxThunkDispatch<
  State,
  null,
  A
>;
export type ActionCreator<A extends Action> = (...args: any[]) => A;
export type ThunkActionCreator<A extends Action, T extends any[] = any[]> = (
  ...args: T
) => (dispatch: ThunkDispatch<A>, getState: () => State) => void;

const makeStore: MakeStore<Store<State, Action>> = (context) => {
  const middleware = [thunkMiddleware, promiseMiddleware];

  if (!IS_PRODUCTION) {
    middleware.unshift(reduxInmutableStateInvariant());
  }

  return createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware))
  );
};

const w = createWrapper<Store<State, Action>>(makeStore, {
  debug: !IS_PRODUCTION,
});

type GetInitialPageProps<P> = NextComponentType<
  NextPageContext,
  any,
  P
>['getInitialProps'];

type AppStore = Omit<
  typeof w,
  'getServerSideProps' | 'getStaticProps' | 'getInitialPageProps'
> & {
  getServerSideProps: <P extends {} = any>(
    callback: (store: Store<State, Action>) => GetServerSideProps<P>
  ) => void;
  getStaticProps: <P extends {} = any>(
    callback: (store: Store<State, Action>) => GetStaticProps<P>
  ) => void;
  getInitialPageProps: <P extends {} = any>(
    callback: (store: Store<State, Action>) => GetInitialPageProps<P>
  ) => void;
};

// `wrapper` is required to be named like this
// but the alias `store` is provided as well to make the code clearer
export const wrapper = (w as unknown) as AppStore;
export const store = (w as unknown) as AppStore;
