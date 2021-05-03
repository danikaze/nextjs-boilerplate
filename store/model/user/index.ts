import { User } from '@model/user';

export type UserState = null | {
  userId: User['userId'];
  username: User['username'];
  role: User['role'];
};
