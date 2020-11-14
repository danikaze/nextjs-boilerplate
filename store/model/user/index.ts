import { User } from '@model/user';

export type UserState = null | {
  id: User['id'];
  username: User['username'];
  role: User['role'];
};
