import csurf from 'csurf';
import { RequestHandler } from 'express';
import { GetServerSideProps } from '@_app';

/**
 * Wrap the `getServerSideProps` function for a page that should provide a
 * CSRF token in order to be sent later via `callApi` (automatically managed)
 */
export function getServerSidePropsWithCsrf<
  // tslint:disable-next-line:no-any
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends {} = {}
>(
  gssp: GetServerSideProps<P, Q>
): GetServerSideProps<P & { csrfToken?: string }, Q> {
  return async (context) => {
    const result = await gssp(context);
    if (!context.req.csrfToken || !('props' in result)) return result;

    const csrfToken = context.req.csrfToken();
    return {
      props: {
        ...result.props,
        csrfToken,
      },
    };
  };
}

type CsrfProtectionOptions = Pick<
  Exclude<Parameters<typeof csurf>[0], undefined>,
  'ignoreMethods'
>;

/**
 * Get the CSRF protection middleware to use in the server or in the APIs
 */
export function csrfProtection(
  options?: CsrfProtectionOptions
): RequestHandler {
  if (!CSRF_ENABLED) {
    // tslint:disable-next-line:no-console
    console.warn(`csrfProtection is being called even with CSRF_ENABLED=false`);
    return (req, res, next) => next();
  }
  return csurf({
    value: (req) => req.headers[CSRF_REQUEST_HEADER_NAME] as string,
    ignoreMethods: options ? options.ignoreMethods : undefined,
    cookie: { key: CSRF_COOKIE_NAME },
  });
}
