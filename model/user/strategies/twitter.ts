import { Profile } from 'passport-twitter';
import { generateUniqueId } from '@model';
import { createUser, getUserAuthData, User, UserAuthData, UserType } from '..';

export interface TwitterUser {
  userId: User['userId'];
  profileId: Profile['id'];
}

export async function authTwitterUser(profile: Profile): Promise<UserAuthData> {
  return getOrCreateUserFromTwitter(profile);
}

export async function getOrCreateUserFromTwitter(
  profile: Profile
): Promise<UserAuthData> {
  const userId = await getUserIdFromTwitter(profile);

  if (!userId) {
    return createUserFromTwitter(profile);
  }

  return (await getUserAuthData(userId))!;
}

/**
 * Get the `userId` from its twitter profile or `undefined` if it doesn't
 * exist
 */
export async function getUserIdFromTwitter(
  profile: Profile
): Promise<User['userId'] | undefined> {
  // dynamic import to avoid loop dependencies when using mock data
  const { TwitterUserDB } = require('../mock');
  const user = TwitterUserDB.find(
    (user: TwitterUser) => user.profileId === profile.id
  );

  return user ? user.userId : undefined;
}

export async function createUserFromTwitter(
  profile: Profile
): Promise<UserAuthData> {
  // dynamic import to avoid loop dependencies when using mock data
  const { UserDB } = require('../mock');
  const { TwitterUserDB } = require('../mock');

  // if there's already a user for this twitter profile, just return it
  const existingUser = await getUserIdFromTwitter(profile);
  if (existingUser) return (await getUserAuthData(existingUser))!;

  // if not, create a new one
  const userId: User['userId'] = generateUniqueId();

  const newUser = await createUser({
    username: profile.username!,
    role: 'user',
    type: UserType.TWITTER_USER,
  });

  TwitterUserDB.push({
    userId,
    profileId: profile.id,
  });

  return newUser;
}
