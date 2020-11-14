export type UserRole = 'admin' | 'user';

export type UserAuthData = Pick<User, 'id' | 'username' | 'role'>;

export interface User {
  id: number;
  username: string;
  role: UserRole;
  salt: string;
  password: string;
}
