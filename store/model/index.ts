import { UserState } from './user';
import { CounterState } from './counter';

export interface State {
  user: UserState;
  count: CounterState;
}
