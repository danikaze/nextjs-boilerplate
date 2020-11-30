import { Profile } from 'passport';
import { authTwitterUser } from './auth';
import { TwitterUserDB, UserDB } from './user-mock';

export type UserRole = 'admin' | 'user';

export type UserAuthData = Pick<User, 'id' | 'username' | 'role'>;

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface LocalUser {
  userId: User['id'];
  username: string;
  salt: string;
  password: string;
}

export interface TwitterUser {
  userId: User['id'];
  profileId: string;
}

export async function createUserFromTwitter(
  profile: Profile
): Promise<UserAuthData> {
  return new Promise(async (resolve) => {
    // if there's already a user for this twitter profile, just return it
    let user = await authTwitterUser(profile);
    if (user) return resolve(user);

    // if not, create a new one
    const userId = (UserDB.length === 0 ? 0 : UserDB[UserDB.length - 1].id) + 1;
    user = {
      id: userId,
      username: profile.username!,
      role: 'user',
    };

    UserDB.push(user);

    TwitterUserDB.push({
      userId,
      profileId: profile.id,
    });

    resolve(user);
  });
}
