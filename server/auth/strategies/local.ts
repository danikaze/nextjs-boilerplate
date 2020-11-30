import { RequestHandler, Router } from 'express';
import { default as passport } from 'passport';
import { Strategy } from 'passport-local';
import { authLocalUser } from '../../../model/auth';
import { addUrlParam } from '../../../utils/url';

export const strategy = new Strategy(async (username, password, done) => {
  try {
    const user = await authLocalUser(username, password);
    if (!user) return done(null, false);
    return done(null, user);
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
