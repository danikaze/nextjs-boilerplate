import { State } from '..';

export const counterSelector = (state: State) => state.count.data;
