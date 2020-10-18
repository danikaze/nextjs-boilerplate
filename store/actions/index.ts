import { HydrateAction } from './hydrate';
import { CounterAction } from './counter';

export interface AppAction {
  type: string;
  payload?: unknown;
  meta?: unknown;
  error?: boolean;
}

/*
 * List of possible app actions to be defined here
 */
type AppActionList = CounterAction;

// the real actions include the Hydrate one, which is internal
export type Action = HydrateAction | AppActionList;
