import express from 'express';
import session from 'cookie-session';
import { default as passport } from 'passport';
import { sync as uid } from 'uid-safe';
import { deserializeUser, serializeUser } from './user-serialization';
import {
  strategy as localStrategy,
  authRoutes as localAuthRoutes,
} from './strategies/local';
import {
  strategy as twitterStrategy,
  authRoutes as twitterAuthRoutes,
} from './strategies/twitter';

/**
 * Set up a Express server to use authentication via PassportJS
 * `server` needs to be configured to use `bodyParser.urlencoded()`
 * This function will add `server.use(session)` as well
 */
export function useAuth(server: express.Express): void {
  // session management
  const SECRET_UID_LENGTH = 18;
  const COOKIE_MAX_AGE = 86400000; // 24 hours in ms

  const sessionConfig: CookieSessionInterfaces.CookieSessionOptions = {
    secret: uid(SECRET_UID_LENGTH),
    maxAge: COOKIE_MAX_AGE,
  };

  // strategy setup
  passport.use(localStrategy);
  if (twitterStrategy) {
    passport.use(twitterStrategy);
  }

  // user serialization
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  // configure Express
  server.use(session(sessionConfig));
  server.use(passport.initialize());
  server.use(passport.session());

  // auth routes
  server.use(localAuthRoutes);
  if (twitterAuthRoutes) {
    server.use(twitterAuthRoutes);
  }
}
