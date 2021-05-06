import { IncomingMessage } from 'http';
import { Request, Response } from 'express';
import { ParsedUrlQuery } from 'querystring';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiResponse,
} from 'next';
import { useSelector } from 'react-redux';
import { userSelector } from '@store/model/user/selectors';
import { ApiHandler, ApiRequest, ApiResponse, HttpStatus } from '@api';
import { UserAuthData } from '@model/user';
import { getLogger } from '@utils/logger';
import { UserState } from '@store/model/user';
import { GetServerSideProps } from '../pages/_app';

export type AuthGetServerSidePropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = GetServerSidePropsContext<Q> & {
  req: { user: UserAuthData };
};

export type AuthApiHandler<
  R = void,
  Q extends {} = {},
  B extends {} = {},
  U extends {} = {}
> = (
  req: AuthApiRequest<Q & U, B>,
  res: NextApiResponse<ApiResponse<R>>
) => void | Promise<void>;

// tslint:disable-next-line: no-any
type IndexedObject = { [key: string]: any };
// tslint:disable-next-line: no-any
type GenericRequest = ApiRequest<any, any>;

type AuthGetServerSideProps<
  // tslint:disable-next-line:no-any
  P extends IndexedObject = IndexedObject,
  Q extends {} = {}
> = (
  context: AuthGetServerSidePropsContext<Q & ParsedUrlQuery>
) => Promise<GetServerSidePropsResult<P>>;

interface AuthApiRequest<Q, B> extends IncomingMessage {
  query: Q;
  body: B;
  cookies: {
    [key: string]: string;
  };
  user: UserAuthData;
  env: {
    [key: string]: string;
  };
}

const logger = getLogger('auth');
const USER_ROLES = ['user', 'admin'];
const ADMIN_ROLES = ['admin'];

/**
 * Hook that returns the available user data in the redux store
 * or `null` if undefined
 */
export function useUserData(): UserState {
  return useSelector(userSelector);
}

/**
 * Wrapper for `getServerSideProps` performing the authentication check first
 * If the user is not logged-in, it will return `noAuthProps`.
 * If the user is properly authenticated then `getServerSideProps` will be
 * called but this time the provided `ctx` is ensured to have `ctx.req.user`
 * with only `UserAuthData` (no `false` value possible)
 */
export function userRequiredServerSideProps<
  P extends IndexedObject = IndexedObject,
  Q extends {} = {}
>(getServerSideProps: AuthGetServerSideProps<P, Q>): GetServerSideProps<P, Q> {
  return authRequiredServerSideProps(USER_ROLES, getServerSideProps);
}

/**
 * Wrapper for `getServerSideProps` performing the authentication check first
 * If the user is not an admin, it will return `noAuthProps`.
 * If the user is properly authenticated as an admin, then `getServerSideProps`
 * will be called but this time the provided `ctx` is ensured to have
 * `ctx.req.user` with only `UserAuthData` (no `false` value possible)
 */
export function adminRequiredServerSideProps<
  P extends IndexedObject = IndexedObject,
  Q extends {} = {}
>(getServerSideProps: AuthGetServerSideProps<P, Q>): GetServerSideProps<P, Q> {
  return authRequiredServerSideProps(ADMIN_ROLES, getServerSideProps);
}

/**
 * Wrapper for `getServerSideProps` that redirects to `AUTH_DO_LOGOUT_URL` if
 * the user is logged in when accesing the page and uses `authProps`.
 * If the user is not logged in, then it just calls the provided
 * `getServerSideProps`
 */
export function logoutRequiredServerSideProps<
  P extends IndexedObject = IndexedObject,
  Q extends {} = {}
>(getServerSideProps: GetServerSideProps<P, Q>): GetServerSideProps<P, Q> {
  return (ctx) => {
    const user = ctx.req.user;

    if (user) {
      logger.verbose(`Redirecting user to the logout page`);
      return Promise.resolve({
        redirect: {
          statusCode: 307,
          destination: AUTH_DO_LOGOUT_URL,
          basePath: false,
        },
      });
    }

    return getServerSideProps(ctx);
  };
}

/**
 * Wrapper for API handler that performs authentication check first, ensuring
 * that `apiHandler` will be called only when the user is properly
 * authenticated or returning a 401 FORBIDDEN error otherwhise.
 *
 * When `apiHandler` is called, the provided `req.user` object is guaranteed
 * to have user data
 */
export function userRequiredApiHandler<
  R = void,
  Q extends {} = {},
  B extends {} = {},
  U extends {} = {}
>(apiHandler: AuthApiHandler<R, Q, B, U>): ApiHandler<R, Q, B, U> {
  return ((req, res) => {
    if (!apiUserWithoutRole(USER_ROLES, req, res)) return;
    return apiHandler(req as AuthApiRequest<Q & U, B>, res);
  }) as ApiHandler<R, Q, B, U>;
}

/**
 * Wrapper for API handler that performs authentication check first, ensuring
 * that `apiHandler` will be called only when the user is properly
 * authenticated as an admin or returning a 401 FORBIDDEN error otherwhise.
 *
 * When `apiHandler` is called, the provided `req.user` object is guaranteed
 * to have user data
 */
export function adminRequiredApiHandler<
  R = void,
  Q extends {} = {},
  B extends {} = {},
  U extends {} = {}
>(apiHandler: AuthApiHandler<R, Q, B, U>): ApiHandler<R, Q, B, U> {
  return ((req, res) => {
    if (!apiUserWithoutRole(ADMIN_ROLES, req, res)) return;
    return apiHandler(req as AuthApiRequest<Q & U, B>, res);
  }) as ApiHandler<R, Q, B, U>;
}

/**
 * Check that a user is properly logged
 */
export function isUser(user: UserAuthData | false): boolean {
  return user && USER_ROLES.includes(user.role);
}

/**
 * Check that a user is logged as an admin role
 */
export function isAdmin(user: UserAuthData | false): boolean {
  return user && ADMIN_ROLES.includes(user.role);
}

function authRequiredServerSideProps<P, Q>(
  role: string[],
  getServerSideProps: AuthGetServerSideProps<P, Q>
): GetServerSideProps<P, Q> {
  return (ctx) => {
    const res = ctx.res as Response;
    const user = ctx.req.user;
    const originalUrl = getRealOriginalUrl(ctx.req);

    if (!user) {
      logger.info(
        `Blocked: Non logged user when tried to access ${originalUrl}`
      );
      return Promise.resolve({
        redirect: {
          statusCode: 307,
          destination: `${AUTH_LOGIN_PAGE}?${AUTH_LOGIN_REDIRECT_PARAM}=${originalUrl}`,
          basePath: false,
        },
      });
    }

    if (!role.includes(user.role)) {
      logger.info(
        `Blocked: Wrong role user when tried to access ${originalUrl}`
      );
      try {
        if (typeof AUTH_FORBIDDEN_PAGE === 'string') {
          return Promise.resolve({
            redirect: {
              statusCode: 307,
              destination: AUTH_FORBIDDEN_PAGE,
              basePath: false,
            },
          });
        }
        res.sendStatus(HttpStatus.HTTP_FORBIDDEN);
      } catch (err) {
        res.sendStatus(HttpStatus.HTTP_FORBIDDEN);
      }
      res.end();
    }

    return getServerSideProps(
      ctx as Parameters<AuthGetServerSideProps<P, Q>>[0]
    );
  };
}

function apiUserWithoutRole(
  role: string[],
  req: GenericRequest,
  res: NextApiResponse
): boolean {
  const user = req.user;
  const originalUrl = getRealOriginalUrl(req);

  // user not logged
  if (!user) {
    logger.info(`Blocked: Not authenticated when accessing API ${originalUrl}`);
    res.status(HttpStatus.HTTP_FORBIDDEN);
    res.json({
      error: true,
      msg: 'Forbidden',
    });
    res.end();
    return false;
  }

  // user logged and auth
  if (role.includes(user.role)) return true;

  // user logged but requested role not found
  logger.info(
    `Blocked: Not enough permissions when accessing API ${originalUrl}`
  );
  res.status(HttpStatus.HTTP_FORBIDDEN);
  res.json({
    error: true,
    msg: 'Forbidden',
  });
  res.end();
  return false;
}

/**
 * When navigating via client-side NextJS doesn't load the full URL but just
 * a JSON with serverSideProps result.
 * This function transforms that URL to obtain the original one
 */
function getRealOriginalUrl(req: IncomingMessage): string {
  const originalUrl = (req as Request).originalUrl;
  const regExp = /^\/_next\/data\/[^/]*(\/.+)\.json$/;
  const match = regExp.exec(originalUrl);
  if (match) return match[1];
  return originalUrl;
}
