import { encryptPasswordSync } from '../utils/crypt';
import { User, LocalUser, TwitterUser } from './user';

/*
 * This is just a mockup for the Database of Users
 * To be replaced with the real data
 */

export const UserDB: User[] = [
  {
    userId: 1,
    username: 'admin',
    role: 'admin',
  },
  {
    userId: 2,
    username: 'user',
    role: 'user',
  },
];

export const LocalUserDB: LocalUser[] = [
  {
    userId: 1,
    username: 'admin',
    salt: '0123456789abcdef',
    password: encryptPasswordSync('pass', '0123456789abcdef'),
  },
  {
    userId: 2,
    username: 'user',
    salt: '1234567890123456',
    password: encryptPasswordSync('pass', '1234567890123456'),
  },
];

export const TwitterUserDB: TwitterUser[] = [];
