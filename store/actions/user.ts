import { ActionCreator } from '@store';
import { UserState } from '@store/model/user';
import { AppAction } from '.';

export type UserAction = SetUserAction | LogoutUserAction;

export interface SetUserAction extends AppAction {
  type: 'SET_USER';
  payload: UserState;
}

export interface LogoutUserAction extends AppAction {
  type: 'LOGOUT_USER';
}

export const setUser: ActionCreator<SetUserAction> = (user: UserState) => ({
  type: 'SET_USER',
  payload: !user
    ? null
    : {
        // all props are manually picked instead of just returning `user`,
        // in case it contains more data that than we want
        userId: user.userId,
        username: user.username,
        role: user.role,
      },
});
