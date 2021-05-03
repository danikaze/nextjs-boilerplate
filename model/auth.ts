import { Profile } from 'passport';
import { encryptPassword } from '../utils/crypt';
import { User, UserAuthData } from './user';
import { LocalUserDB, TwitterUserDB, UserDB } from './user-mock';

export async function getUserAuthData(
  userId: number | User
): Promise<UserAuthData | undefined> {
  const user =
    typeof userId === 'number'
      ? UserDB.find((u) => u.userId === userId)
      : userId;
  if (!user) return;

  return {
    userId: user.userId,
    username: user.username,
    role: user.role,
  };
}

export async function authLocalUser(
  username: string,
  password: string
): Promise<UserAuthData | undefined> {
  return new Promise(async (resolve) => {
    // 1. Find the user in the database
    // TODO: Replace with the real model instead of mock-data
    const lcUser = username.toLowerCase();
    const user = LocalUserDB.find((u) => u.username.toLowerCase() === lcUser);
    if (!user) return resolve(undefined);

    // 2. Encode the provided password with its salt
    const pwd = await encryptPassword(password, user.salt);
    // 3. Check if the encoded(provided password)
    // is the same as the provided password
    if (pwd !== user.password) return resolve(undefined);

    // 4. if ok, return the UserAuthData
    resolve(await getUserAuthData(user.userId));
  });
}

export async function authTwitterUser(
  profile: Profile
): Promise<UserAuthData | undefined> {
  return new Promise(async (resolve) => {
    // 1. Find the user in the database
    // TODO: Replace with the real model instead of mock-data
    const user = TwitterUserDB.find((u) => u.profileId === profile.id);
    if (!user) return resolve(undefined);

    // 2. if ok, return the UserAuthData
    resolve(await getUserAuthData(user.userId));
  });
}
