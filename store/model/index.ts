import { Metadata } from './metadata';
import { CounterState } from './counter';

export interface State {
  metadata: Metadata;
  count: CounterState;
}
