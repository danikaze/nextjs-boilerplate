import express from 'express';
import session from 'cookie-session';
import { default as passport } from 'passport';
import { sync as uid } from 'uid-safe';
import { strategy as localStrategy, authRoutes } from './strategies/local';
import { deserializeUser, serializeUser } from './user-serialization';

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

  // user serialization
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  // configure Express
  server.use(session(sessionConfig));
  server.use(passport.initialize());
  server.use(passport.session());
  server.use(authRoutes);
}
