import { generateUniqueId } from '@model';

export type UserRole = 'admin' | 'user';

export type UserAuthData = Pick<User, 'userId' | 'username' | 'role'>;

export const enum UserType {
  SYSTEM_USER = 'sy', // system (no login)
  LOCAL_USER = 'lc', // local (user + pass)
  TWITTER_USER = 'tw', // twitter
}

export interface User {
  userId: string;
  username: string;
  role: UserRole;
  type: UserType;
}

type CreateUserData = Pick<User, 'username' | 'role' | 'type'>;

export async function getUserAuthData(
  userId: string | User
): Promise<UserAuthData | undefined> {
  // dynamic import to avoid loop dependencies when using mock data
  const { UserDB } = require('./mock');

  const user =
    typeof userId === 'number'
      ? UserDB.find((user: User) => user.userId === userId)
      : userId;
  if (!user) return;

  return {
    userId: user.userId,
    username: user.username,
    role: user.role,
  };
}

export async function createUser(user: CreateUserData): Promise<UserAuthData> {
  // dynamic import to avoid loop dependencies when using mock data
  const { UserDB } = require('./mock');

  const userId: User['userId'] = generateUniqueId();

  const newUser: User = {
    ...user,
    userId,
  };

  UserDB.push(newUser);

  return {
    userId,
    username: newUser.username,
    role: newUser.role,
  };
}
