import { createLocalUser, LocalUser } from './strategies/local';
import { TwitterUser } from './strategies/twitter';
import { User } from '.';

/*
 * This is just a mockup for the Database of Users
 * To be replaced with the real data
 */

export const UserDB: User[] = [];
export const LocalUserDB: LocalUser[] = [];
export const TwitterUserDB: TwitterUser[] = [];

(async () => {
  createLocalUser({
    username: 'admin',
    role: 'admin',
    password: 'pass',
  });
  createLocalUser({
    username: 'user',
    role: 'user',
    password: 'pass',
  });
})();
