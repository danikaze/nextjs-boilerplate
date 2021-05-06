import { UserAuthData } from '@model/user';

/**
 * `serializeUser` is the function user by passport that defines what data is
 * actually stored in the session data. It can be just the `user.userId` but we
 * are storing its username and roles too, to have them a accessible without
 * hitting the database
 */
export function serializeUser(
  user: Express.User,
  done: (err: null | Error, data?: UserAuthData) => void
): void {
  return done(null, user as UserAuthData);
}

/**
 * `deserializeUser` is the function user by passport that retrieves the user
 * data from the session data. Since we are storing the whole object with
 * { id, username, roles }, (data used for auth) we just need to return it
 * without hitting the database to get more data.
 */
export function deserializeUser(
  data: UserAuthData,
  done: (err: null | Error, user?: Express.User | false | null) => void
): void {
  return done(null, data);
}
