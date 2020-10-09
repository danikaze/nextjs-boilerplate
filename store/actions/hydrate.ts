import { HYDRATE } from 'next-redux-wrapper';
import { State } from '@store/model';
import { AppAction } from '.';

// HydrateAction is required by next-redux-wrapper and added here internally
// no need to touch this file
export type HydrateAction = AppAction & {
  type: typeof HYDRATE;
  payload?: Partial<State>;
};
