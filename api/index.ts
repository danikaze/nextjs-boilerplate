import { NextApiHandler, NextApiResponse } from 'next';
import { IncomingMessage } from 'http';
import { Request, Response, RequestHandler } from 'express';
import { UserAuthData } from '@model/user';
import { NsLogger } from '@utils/logger';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
/* | 'CONNECT' | 'OPTIONS' | 'TRACE' */

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export enum HttpStatus {
  // 2xx Success
  OK = 200,
  // 4xx Client Error
  BAD_REQUEST = 400,
  HTTP_FORBIDDEN = 401,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  // 5xx Server Error
}

export interface ScalarKeyValue {
  [key: string]: number | string;
}

export type RestApiHandlerMethods<
  GETR = void,
  GETQ extends {} = {},
  GETB extends {} = {},
  GETU extends {} = {},
  POSTR = void,
  POSTQ extends {} = {},
  POSTB extends {} = {},
  POSTU extends {} = {},
  PUTR = void,
  PUTQ extends {} = {},
  PUTB extends {} = {},
  PUTU extends {} = {},
  DELETER = void,
  DELETEQ extends {} = {},
  DELETEB extends {} = {},
  DELETEU extends {} = {}
> = {
  GET?: ApiHandler<GETR, GETQ, GETB, GETU>;
  POST?: ApiHandler<POSTR, POSTQ, POSTB, POSTU>;
  PUT?: ApiHandler<PUTR, PUTQ, PUTB, PUTU>;
  DELETE?: ApiHandler<DELETER, DELETEQ, DELETEB, DELETEU>;
};

export type ApiResponse<R> =
  | {
      data: R;
    }
  | {
      error: true;
      msg?: string;
      id?: string;
    };

/* Redeclaration of NextApiRequest to provide typings on `query` and `body` */
export interface ApiRequest<Q, B> extends IncomingMessage {
  query: Q;
  body: B;
  cookies: {
    [key: string]: string;
  };
  user: UserAuthData | false;
  env: {
    [key: string]: string;
  };
}

/*
 * Redeclaration of NextApiHandler to provide typings on:
 * R: Return type
 * Q: Query parameters
 * B: Body data
 * U: URL data. It's also provided in the query but coming from the slug url,
 *    not from the `params` option. So if a url is like `/game/[gameId]`
 *    `U` would be `{ gameId: string }`
 */
export type ApiHandler<
  R = void,
  Q extends {} = {},
  B extends {} = {},
  U extends {} = {}
> = (
  req: ApiRequest<Q & U, B>,
  res: NextApiResponse<ApiResponse<R>>
) => void | Promise<void>;

export function restApiHandler<
  GETR = void,
  GETQ extends {} = {},
  GETB extends {} = {},
  GETU extends {} = {},
  POSTR = void,
  POSTQ extends {} = {},
  POSTB extends {} = {},
  POSTU extends {} = {},
  PUTR = void,
  PUTQ extends {} = {},
  PUTB extends {} = {},
  PUTU extends {} = {},
  DELETER = void,
  DELETEQ extends {} = {},
  DELETEB extends {} = {},
  DELETEU extends {} = {}
>(
  handlers: RestApiHandlerMethods<
    GETR,
    GETQ,
    GETB,
    GETU,
    POSTR,
    POSTQ,
    POSTB,
    POSTU,
    PUTR,
    PUTQ,
    PUTB,
    PUTU,
    DELETER,
    DELETEQ,
    DELETEB,
    DELETEU
  >,
  middleware?: RequestHandler
): NextApiHandler {
  return async (req, res) => {
    if (middleware) {
      await runMiddleware(
        (req as unknown) as Request,
        (res as unknown) as Response,
        middleware
      );
    }

    const handler = handlers[req.method as HttpMethod] as NextApiHandler;
    if (!handler) {
      res.setHeader('Allow', Object.keys(handlers));
      res
        .status(HttpStatus.METHOD_NOT_ALLOWED)
        .end(`Method ${req.method} Not Allowed`);
      return;
    }

    try {
      await handler(req, res);
    } catch (error) {
      apiError(res, { error });
    }
  };
}

/**
 * Send an "Error" response.
 * `httpCode` is by default HttpStatus.BAD_REQUEST (400)
 */
export function apiError<E extends Error = Error>(
  res: NextApiResponse,
  data: {
    error: E | string;
    httpCode?: HttpStatus;
  }
): void;

/**
 * Send an "Error" response AND logs an `error` in the provided logger.
 * The logged message will be the full error, and the response message
 * will be the provided one (to hide internal information).
 * Both, response and logged error will be linked by the same errorId so
 * they can be found in server logs to debug with better details.
 */
export function apiError<E extends Error = Error>(
  res: NextApiResponse,
  data: {
    error: E | string;
    logger: NsLogger;
    responseError: string;
    httpCode?: HttpStatus;
  }
): void;

export function apiError<E extends Error = Error>(
  res: NextApiResponse,
  data: {
    error: E | string;
    logger?: NsLogger;
    responseError?: string;
    httpCode?: HttpStatus;
  }
): void {
  const { error, logger, responseError, httpCode } = data;

  if (responseError) {
    // tslint:disable-next-line:no-magic-numbers
    const errorId = `${Date.now()}.${String(Math.random()).substr(2, 4)}`;
    logger!.error(errorId, error);

    return res.status(httpCode || HttpStatus.BAD_REQUEST).json({
      error: true,
      msg: responseError,
      id: errorId,
    });
  }

  res.status(httpCode || HttpStatus.BAD_REQUEST).json({
    error: true,
    msg: String(error),
  });
}

function runMiddleware(req: Request, res: Response, fn: RequestHandler) {
  return new Promise<void>((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve();
    });
  });
}
