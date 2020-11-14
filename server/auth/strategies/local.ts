import { RequestHandler, Router } from 'express';
import { default as passport } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../../../model/user';
import { encryptPassword, encryptPasswordSync } from '../../../model/auth';
import { addUrlParam } from '../../../utils/url';

/*
 * This is just a mockup for the Database of Users
 * To be replaced with the real model
 */
const UserDB: User[] = [
  {
    id: 1,
    username: 'admin',
    role: 'admin',
    salt: '0123456789abcdef',
    password: encryptPasswordSync('pass', '0123456789abcdef'),
  },
  {
    id: 2,
    username: 'user',
    role: 'user',
    salt: '1234567890123456',
    password: encryptPasswordSync('pass', '1234567890123456'),
  },
];

export const strategy = new Strategy(async (username, password, done) => {
  // 1. Find the user in the database
  // TODO: Replace with the real model instead of mock-data
  const lcUser = username.toLowerCase();
  const user = UserDB.find((u) => u.username.toLowerCase() === lcUser);
  if (!user) return done(null, false);

  // 2. Encode the provided password with its salt
  try {
    const pwd = await encryptPassword(password, user.salt);
    // 3. Check if the encoded(provided password)
    // is the same as the provided password
    if (pwd !== user.password) return done(null, false);

    // if ok, return the UserAuthData
    return done(null, {
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    return done(err, false);
  }
});

/**
 * The login route is the one that receives the user/pass and applies the
 * authentication strategy
 * If successful, then it goes to the loginCallback page
 */
const loginRoute: RequestHandler = (req, res) => {
  const redirect = AUTH_LOGIN_REDIRECT_PARAM
    ? req.body[AUTH_LOGIN_REDIRECT_PARAM]
    : undefined;
  const successRedirect = redirect || AUTH_LOGIN_SUCCESS_PAGE;
  const failureRedirect = AUTH_LOGIN_REDIRECT_PARAM
    ? addUrlParam(AUTH_LOGIN_FAIL_PAGE, AUTH_LOGIN_REDIRECT_PARAM, redirect)
    : AUTH_LOGIN_FAIL_PAGE;

  passport.authenticate('local', {
    successRedirect,
    failureRedirect,
  })(req, res);
};

const logoutRoute: RequestHandler = (req, res) => {
  req.logOut();
  res.redirect(AUTH_LOGOUT_PAGE);
};

export const authRoutes = Router();
authRoutes.post(AUTH_LOCAL_DO_LOGIN_URL, loginRoute);
authRoutes.get(AUTH_DO_LOGOUT_URL, logoutRoute);
