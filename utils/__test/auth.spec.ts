import 'jest';
import sinon from 'sinon';
import { NextApiResponse } from 'next';
import { ApiRequest, HttpStatus } from '@api';
import { UserAuthData, UserRole } from '@model/user';
import { resetAllGlobalValues, setGlobalValue } from '@test/set-global-value';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
} from '../../pages/_app';
import {
  userRequiredServerSideProps,
  adminRequiredServerSideProps,
  logoutRequiredServerSideProps,
  userRequiredApiHandler,
  adminRequiredApiHandler,
  isUser,
  isAdmin,
} from '../auth';

// tslint:disable-next-line: no-any
type GenericRequest = ApiRequest<any, any>;

describe('isUser', () => {
  it('should return false for non-logged users', () => {
    const user = getUserData(false);
    expect(isUser(user)).toBeFalsy();
  });

  it('should return false for non-expected role users', () => {
    const user = getUserData('wrong-role');
    expect(isUser(user)).toBeFalsy();
  });

  it('should return false for users', () => {
    const user = getUserData('user');
    expect(isUser(user)).toBeTruthy();
  });

  it('should return false for admins', () => {
    const user = getUserData('admin');
    expect(isUser(user)).toBeTruthy();
  });
});

describe('isAdmin', () => {
  it('should return false for non-logged users', () => {
    const user = getUserData(false);
    expect(isAdmin(user)).toBeFalsy();
  });

  it('should return false for non-expected role users', () => {
    const user = getUserData('wrong-role');
    expect(isAdmin(user)).toBeFalsy();
  });

  it('should return false for users', () => {
    const user = getUserData('user');
    expect(isAdmin(user)).toBeFalsy();
  });

  it('should return false for admins', () => {
    const user = getUserData('admin');
    expect(isAdmin(user)).toBeTruthy();
  });
});

describe('userRequiredServerSideProps', () => {
  afterEach(() => {
    resetAllGlobalValues();
  });

  it('should redirect access of non-logged users', async () => {
    const { notCalledGSSP, ctx } = getTestData(false);
    const getServerSideProps = userRequiredServerSideProps(notCalledGSSP);
    const result = await getServerSideProps(ctx);
    if (!('redirect' in result)) return fail();
    expect(result.redirect.destination).toMatch(AUTH_LOGIN_PAGE);
    expect(notCalledGSSP.called).toBeFalsy();
  });

  it('should redirect access of non-expected role users when AUTH_FORBIDDEN_PAGE is set', async () => {
    const forbiddenPage = '/forbidden';
    setGlobalValue('AUTH_FORBIDDEN_PAGE', forbiddenPage);
    const { notCalledGSSP, ctx } = getTestData('wrong-role');
    const getServerSideProps = userRequiredServerSideProps(notCalledGSSP);
    const result = await getServerSideProps(ctx);
    if (!('redirect' in result)) return fail();
    expect(result.redirect.destination).toMatch(AUTH_FORBIDDEN_PAGE);
    expect(notCalledGSSP.called).toBeFalsy();
  });

  it('should just send HTTP_FORBIDDEN when AUTH_FORBIDDEN_PAGE is not set', async () => {
    const forbiddenPage = undefined;
    setGlobalValue('AUTH_FORBIDDEN_PAGE', forbiddenPage);
    const { notCalledGSSP, spy, ctx } = getTestData('wrong-role');
    const getServerSideProps = userRequiredServerSideProps(notCalledGSSP);
    const result = await getServerSideProps(ctx);
    if (!('redirect' in result)) return fail();
    expect(spy.res.sendStatus.firstCall.firstArg).toBe(
      HttpStatus.HTTP_FORBIDDEN
    );
    expect(spy.res.end.called).toBeTruthy();
    expect(notCalledGSSP.called).toBeFalsy();
  });

  it('should just send HTTP_FORBIDDEN without failing if AUTH_FORBIDDEN_PAGE is set to an invalid url', async () => {
    const invalidPage = 123;
    setGlobalValue('AUTH_FORBIDDEN_PAGE', invalidPage);
    const { notCalledGSSP, spy, ctx } = getTestData('wrong-role');
    const getServerSideProps = userRequiredServerSideProps(notCalledGSSP);
    const result = await getServerSideProps(ctx);
    if (!('redirect' in result)) return fail();
    expect(spy.res.sendStatus.firstCall.firstArg).toBe(
      HttpStatus.HTTP_FORBIDDEN
    );
    expect(spy.res.end.called).toBeTruthy();
    expect(notCalledGSSP.called).toBeFalsy();
  });

  it('should allow access of logged users', async () => {
    const { userProps, userGSSP, spy, ctx } = getTestData('user');
    const getServerSideProps = userRequiredServerSideProps(userGSSP);
    const result = await getServerSideProps(ctx);
    if (!('props' in result)) return fail();
    expect(result.props).toEqual(userProps);
    expect(spy.res.redirect.called).toBeFalsy();
    expect(userGSSP.called).toBeTruthy();
  });

  it('should allow access of admin users', async () => {
    const { userProps, userGSSP, spy, ctx } = getTestData('admin');
    const getServerSideProps = userRequiredServerSideProps(userGSSP);
    const result = await getServerSideProps(ctx);
    if (!('props' in result)) return fail();
    expect(result.props).toEqual(userProps);
    expect(spy.res.redirect.called).toBeFalsy();
    expect(userGSSP.called).toBeTruthy();
  });
});

describe('adminRequiredServerSideProps', () => {
  it('should redirect access of non-logged users', async () => {
    const { notCalledGSSP, spy, ctx } = getTestData(false);
    const getServerSideProps = adminRequiredServerSideProps(notCalledGSSP);
    const result = await getServerSideProps(ctx);
    if (!('redirect' in result)) return fail();
    expect(result.redirect.destination).toMatch(AUTH_LOGIN_PAGE);
    expect(spy.res.end.called).toBeFalsy();
    expect(notCalledGSSP.called).toBeFalsy();
  });

  it('should redirect access of non-expected role users', async () => {
    const { notCalledGSSP, spy, ctx } = getTestData('wrong-role');
    const getServerSideProps = adminRequiredServerSideProps(notCalledGSSP);
    const result = await getServerSideProps(ctx);
    if (AUTH_FORBIDDEN_PAGE) {
      if (!('redirect' in result)) return fail();
      expect(result.redirect.destination).toMatch(AUTH_FORBIDDEN_PAGE);
      expect(spy.res.end.called).toBeFalsy();
    } else {
      expect(spy.res.sendStatus.firstCall.firstArg).toBe(
        HttpStatus.HTTP_FORBIDDEN
      );
      expect(spy.res.end.called).toBeTruthy();
    }
    expect(notCalledGSSP.called).toBeFalsy();
  });

  it('should not allow access of simple users', async () => {
    const { notCalledGSSP, spy, ctx } = getTestData('user');
    const getServerSideProps = adminRequiredServerSideProps(notCalledGSSP);
    const result = await getServerSideProps(ctx);
    if (AUTH_FORBIDDEN_PAGE) {
      if (!('redirect' in result)) return fail();
      expect(result.redirect.destination).toMatch(AUTH_FORBIDDEN_PAGE);
      expect(spy.res.end.called).toBeFalsy();
    } else {
      expect(spy.res.sendStatus.firstCall.firstArg).toBe(
        HttpStatus.HTTP_FORBIDDEN
      );
      expect(spy.res.end.called).toBeTruthy();
    }
    expect(notCalledGSSP.called).toBeFalsy();
  });

  it('should allow access of admin users', async () => {
    const { userProps, userGSSP, spy, ctx } = getTestData('admin');
    const getServerSideProps = adminRequiredServerSideProps(userGSSP);
    const result = await getServerSideProps(ctx);
    if (!('props' in result)) return fail();
    expect(result.props).toEqual(userProps);
    expect(spy.res.redirect.called).toBeFalsy();
    expect(userGSSP.called).toBeTruthy();
  });
});

describe('logoutRequiredServerSideProps', () => {
  it('should logout users', async () => {
    const { notCalledGSSP, spy, ctx } = getTestData('user');
    const getServerSideProps = logoutRequiredServerSideProps(notCalledGSSP);
    const result = await getServerSideProps(ctx);
    if (!('redirect' in result)) return fail();
    expect(result.redirect.destination).toMatch(AUTH_DO_LOGOUT_URL);
    expect(spy.res.redirect.called).toBeFalsy();
    expect(notCalledGSSP.called).toBeFalsy();
  });

  it('should do nothing for already non-logged in users', async () => {
    const { noUserProps, noUserGSSP, spy, ctx } = getTestData(false);
    const getServerSideProps = logoutRequiredServerSideProps(noUserGSSP);
    const result = await getServerSideProps(ctx);
    if (!('props' in result)) return fail();
    expect(result.props).toEqual(noUserProps);
    expect(spy.res.redirect.called).toBeFalsy();
    expect(noUserGSSP.called).toBeTruthy();
  });
});

describe('userRequiredApiHandler', () => {
  it('should return 401 error when a non-logged users tries to access', () => {
    const { spy, req, res, notCalledApiHandler } = getTestData(false);
    const apiHandler = userRequiredApiHandler(notCalledApiHandler);
    apiHandler(req, res);
    expect(notCalledApiHandler.called).toBeFalsy();
    expect(spy.res.status.firstCall.firstArg).toBe(HttpStatus.HTTP_FORBIDDEN);
    expect(spy.res.end.called).toBeTruthy();
  });

  it('should return 401 error when a user with wrong role tries to access', () => {
    const { spy, req, res, notCalledApiHandler } = getTestData('wrong-role');
    const apiHandler = userRequiredApiHandler(notCalledApiHandler);
    apiHandler(req, res);
    expect(notCalledApiHandler.called).toBeFalsy();
    expect(spy.res.status.firstCall.firstArg).toBe(HttpStatus.HTTP_FORBIDDEN);
    expect(spy.res.end.called).toBeTruthy();
  });

  it('should allow access when an authenticated user accesses', () => {
    const { spy, req, res, authApiHandler } = getTestData('user');
    const apiHandler = userRequiredApiHandler(authApiHandler);
    apiHandler(req, res);
    expect(authApiHandler.called).toBeTruthy();
    expect(authApiHandler.firstCall.args[0]).toBe(req);
    expect(authApiHandler.firstCall.args[1]).toBe(res);
    expect(spy.res.status.called).toBeFalsy();
  });

  it('should allow access when an admin user accesses', () => {
    const { spy, req, res, authApiHandler } = getTestData('admin');
    const apiHandler = userRequiredApiHandler(authApiHandler);
    apiHandler(req, res);
    expect(authApiHandler.called).toBeTruthy();
    expect(authApiHandler.firstCall.args[0]).toBe(req);
    expect(authApiHandler.firstCall.args[1]).toBe(res);
    expect(spy.res.status.called).toBeFalsy();
  });
});

describe('adminRequiredApiHandler', () => {
  it('should return 401 error when a non-logged users tries to access', () => {
    const { spy, req, res, notCalledApiHandler } = getTestData(false);
    const apiHandler = adminRequiredApiHandler(notCalledApiHandler);
    apiHandler(req, res);
    expect(notCalledApiHandler.called).toBeFalsy();
    expect(spy.res.status.firstCall.firstArg).toBe(HttpStatus.HTTP_FORBIDDEN);
    expect(spy.res.end.called).toBeTruthy();
  });

  it('should return 401 error when a user with wrong role tries to access', () => {
    const { spy, req, res, notCalledApiHandler } = getTestData('wrong-role');
    const apiHandler = adminRequiredApiHandler(notCalledApiHandler);
    apiHandler(req, res);
    expect(notCalledApiHandler.called).toBeFalsy();
    expect(spy.res.status.firstCall.firstArg).toBe(HttpStatus.HTTP_FORBIDDEN);
    expect(spy.res.end.called).toBeTruthy();
  });

  it('should  return 401 error when an basic user accesses', () => {
    const { spy, req, res, notCalledApiHandler } = getTestData('user');
    const apiHandler = adminRequiredApiHandler(notCalledApiHandler);
    apiHandler(req, res);
    expect(notCalledApiHandler.called).toBeFalsy();
    expect(spy.res.status.firstCall.firstArg).toBe(HttpStatus.HTTP_FORBIDDEN);
    expect(spy.res.end.called).toBeTruthy();
  });

  it('should allow access when an admin user accesses', () => {
    const { spy, req, res, authApiHandler } = getTestData('admin');
    const apiHandler = adminRequiredApiHandler(authApiHandler);
    apiHandler(req, res);
    expect(authApiHandler.called).toBeTruthy();
    expect(authApiHandler.firstCall.args[0]).toBe(req);
    expect(authApiHandler.firstCall.args[1]).toBe(res);
    expect(spy.res.status.called).toBeFalsy();
  });
});

/*
 * Test helpers
 */
function getUserData(role: string | false): UserAuthData | false {
  return (
    (role && {
      role: role as UserRole,
      username: 'username',
      userId: 1,
    }) ||
    false
  );
}

function getTestData(role: string | false, originalUrl: string = 'url') {
  const userProps = { user: true };
  const noUserProps = { user: false };

  const notCalledGSSP = sinon.spy((async () => ({
    props: {},
  })) as GetServerSideProps);

  const userGSSP = sinon.spy((async () => ({
    props: userProps,
  })) as GetServerSideProps);

  const noUserGSSP = sinon.spy((async () => ({
    props: noUserProps,
  })) as GetServerSideProps);

  const authApiHandler = sinon.spy((req, res) => {
    expect(req.user).toBeTruthy();
  });

  const notCalledApiHandler = sinon.spy(() => {
    expect(true).toBeFalsy();
  });

  const user = getUserData(role);
  const req = { originalUrl, user };
  const res = {
    redirect: sinon.stub(),
    status: sinon.stub(),
    json: sinon.stub(),
    sendStatus: sinon.stub(),
    end: sinon.stub(),
  };
  const ctx = ({
    req,
    res,
  } as unknown) as GetServerSidePropsContext;

  res.redirect.callsFake((url: unknown) => {
    // simulate an exception when url is invalid
    if (typeof url !== 'string') {
      throw new Error('Wrong URL to redirect');
    }
  });

  return {
    userProps,
    noUserProps,
    ctx,
    notCalledGSSP,
    userGSSP,
    noUserGSSP,
    authApiHandler,
    notCalledApiHandler,
    req: (req as unknown) as GenericRequest,
    res: (res as unknown) as NextApiResponse,
    spy: { res },
  };
}

function fail() {
  expect(false).toBeTruthy;
}
