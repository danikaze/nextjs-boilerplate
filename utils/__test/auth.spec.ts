import 'jest';
import { GetServerSidePropsContext } from 'next';
import sinon from 'sinon';
import { Request, Response, NextFunction } from 'express';
import { UserAuthData, UserRole } from '@model/user';
import { resetAllGlobalValues, setGlobalValue } from '@test/set-global-value';
import { adminRequired, logoutRequired, userRequired } from '../auth';

type ParamShaper = typeof getCtxParams | typeof getMiddlewareParams;

/*
 * runTest is just a way to define the same test cases and run them twice
 * with different parameters but without code duplication
 */
function runTest(desc: string, paramShaper: ParamShaper) {
  // shapeParams is just a wrapper so paramShaper returns the correct parameters
  const shapeParams = paramShaper as typeof getCtxParams;
  const HTTP_FORBIDDEN = 401;

  describe(`userRequired (${desc})`, () => {
    it('should allow accesses of logged users', () => {
      const data = getTestData('user');
      const params = shapeParams(data);
      const res = userRequired(...params);
      expect(res).toBeUndefined();
      expect(data.res.redirect.called).toBeFalsy();
    });

    it('should allow accesses of logged admins', () => {
      const data = getTestData('admin');
      const params = shapeParams(data);
      const res = userRequired(...params);
      expect(res).toBeUndefined();
      expect(data.res.redirect.called).toBeFalsy();
    });

    it('should redirect access of non-logged users', () => {
      const data = getTestData(false);
      const params = shapeParams(data);
      const res = userRequired(...params);
      expect(res).toBe(true);
      expect(data.res.redirect.called).toBeTruthy();
      expect(data.res.redirect.firstCall.firstArg).toMatch(AUTH_LOGIN_PAGE);
    });
  });

  describe(`adminRequired (${desc})`, () => {
    afterEach(() => {
      resetAllGlobalValues();
    });

    it('should redirect access of logged users but without the correct role, when AUTH_FORBIDDEN_PAGE is set', () => {
      const forbidenPage = '/forbidden';
      setGlobalValue('AUTH_FORBIDDEN_PAGE', forbidenPage);

      const data = getTestData('user');
      const params = shapeParams(data);
      const res = adminRequired(...params);
      expect(res).toBe(true);
      expect(data.res.redirect.called).toBeTruthy();
      expect(data.res.redirect.firstCall.firstArg).toBe(forbidenPage);
      expect(data.res.sendStatus.called).toBeFalsy();
    });

    it('should send 401 for logged users but without the correct role, when AUTH_FORBIDDEN_PAGE is not set', () => {
      setGlobalValue('AUTH_FORBIDDEN_PAGE', undefined);

      const data = getTestData('user');
      const params = shapeParams(data);
      const res = adminRequired(...params);
      expect(res).toBe(true);
      expect(data.res.redirect.called).toBeFalsy();
      expect(data.res.sendStatus.called).toBeTruthy();
      expect(data.res.sendStatus.firstCall.firstArg).toBe(HTTP_FORBIDDEN);
    });

    it('should send 401 for logged users but without the correct role, when AUTH_FORBIDDEN_PAGE is set but empty', () => {
      setGlobalValue('AUTH_FORBIDDEN_PAGE', '');

      const data = getTestData('user');
      const params = shapeParams(data);
      const res = adminRequired(...params);
      expect(res).toBe(true);
      expect(data.res.redirect.called).toBeFalsy();
      expect(data.res.sendStatus.called).toBeTruthy();
      expect(data.res.sendStatus.firstCall.firstArg).toBe(HTTP_FORBIDDEN);
    });

    it('should send 401 for logged users but without the correct role, when AUTH_FORBIDDEN_PAGE is set to an invalid value', () => {
      setGlobalValue('AUTH_FORBIDDEN_PAGE', []);

      const data = getTestData('user');
      const params = shapeParams(data);
      const res = adminRequired(...params);
      expect(res).toBe(true);
      expect(data.res.redirect.called).toBeTruthy();
      // ^ redirect is called but with wrong parameter
      expect(data.res.sendStatus.called).toBeTruthy();
      expect(data.res.sendStatus.firstCall.firstArg).toBe(HTTP_FORBIDDEN);
    });
  });

  describe(`logoutRequired (${desc})`, () => {
    it('should logout users', () => {
      const data = getTestData('user');
      const params = shapeParams(data);
      const res = logoutRequired(...params);
      expect(res).toBe(true);
      expect(data.res.redirect.called).toBeTruthy();
      expect(data.res.redirect.firstCall.firstArg).toMatch(AUTH_DO_LOGOUT_URL);
    });

    it('should do nothing for already logged out users', () => {
      const data = getTestData(false);
      const params = shapeParams(data);
      const res = logoutRequired(...params);
      expect(res).toBeUndefined;
      expect(data.res.redirect.called).toBeFalsy();
    });
  });
}

runTest('ctx', getCtxParams);
runTest('express middleware', getMiddlewareParams);

/**
 * Prepares data for the test
 */
function getTestData(role: UserRole | false, originalUrl: string = 'url') {
  const user: UserAuthData | false =
    (role && {
      role,
      username: 'username',
      id: 1,
    }) ||
    false;
  const req = { originalUrl, user };
  const res = {
    redirect: sinon.stub(),
    sendStatus: sinon.stub(),
    end: sinon.stub(),
  };

  res.redirect.callsFake((url: unknown) => {
    // simulate an exception when url is invalid
    if (typeof url !== 'string') {
      throw new Error('Wrong URL to redirect');
    }
  });

  return {
    req,
    res,
  };
}

/**
 * Shapes the test data as Ctx-like parameters
 */
function getCtxParams({
  req,
  res,
}: ReturnType<typeof getTestData>): [GetServerSidePropsContext] {
  return [
    ({
      req,
      res,
    } as unknown) as GetServerSidePropsContext,
  ];
}

/**
 * Shapes the test data as parameters for a express middleware
 */
function getMiddlewareParams({
  req,
  res,
}: ReturnType<typeof getTestData>): [Request, Response, NextFunction] {
  return [(req as unknown) as Request, (res as unknown) as Response, () => {}];
}
