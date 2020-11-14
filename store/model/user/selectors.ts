import { State } from '..';

export const userSelector = (state: State) => state.user;
export const usernameSelector = (state: State) => state.user?.username;
