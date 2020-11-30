import { RequestHandler } from 'express';
import { default as passport } from 'passport';
import { addUrlParam } from '../../utils/url';

function getLoginRoute(strategy: string): RequestHandler {
  return (req, res) => {
    const redirect = AUTH_LOGIN_REDIRECT_PARAM
      ? req.body[AUTH_LOGIN_REDIRECT_PARAM]
      : undefined;
    const successRedirect = redirect || AUTH_LOGIN_SUCCESS_PAGE;
    const failureRedirect = AUTH_LOGIN_REDIRECT_PARAM
      ? addUrlParam(AUTH_LOGIN_FAIL_PAGE, AUTH_LOGIN_REDIRECT_PARAM, redirect)
      : AUTH_LOGIN_FAIL_PAGE;

    passport.authenticate(strategy, {
      successRedirect,
      failureRedirect,
    })(req, res);
  };
}
