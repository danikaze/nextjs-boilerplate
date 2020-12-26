import { Router } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-twitter';
import { authTwitterUser } from '../../../model/auth';
import { createUserFromTwitter } from '../../../model/user';

export const twitterEnabled = (() => {
  try {
    return (
      AUTH_TWITTER_LOGIN_PAGE !== '' &&
      AUTH_TWITTER_CALLBACK_ABS_URL !== '' &&
      AUTH_TWITTER_API_KEY !== '' &&
      AUTH_TWITTER_API_KEY_SECRET !== ''
    );
  } catch (err) {
    return false;
  }
})();

export const strategy =
  twitterEnabled &&
  new Strategy(
    {
      consumerKey: AUTH_TWITTER_API_KEY,
      consumerSecret: AUTH_TWITTER_API_KEY_SECRET,
      callbackURL: AUTH_TWITTER_CALLBACK_ABS_URL,
    },
    async (token, tokenSecret, profile, done) => {
      if (!profile) {
        return done('Error while authenticating Twitter', false);
      }
      try {
        let user = await authTwitterUser(profile);
        if (user) {
          return done(null, user);
        }
        // If a user from twitter is not found, just create one
        user = await createUserFromTwitter(profile);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  );

export const authRoutes =
  twitterEnabled &&
  (() => {
    const url = new URL(AUTH_TWITTER_CALLBACK_ABS_URL);

    const authRoutes = Router();
    authRoutes.get(AUTH_TWITTER_LOGIN_PAGE, passport.authenticate('twitter'));
    authRoutes.get(
      url.pathname,
      passport.authenticate('twitter', {
        successRedirect: AUTH_LOGIN_SUCCESS_PAGE,
        failureRedirect: AUTH_LOGIN_FAIL_PAGE,
      })
    );
    return authRoutes;
  })();
