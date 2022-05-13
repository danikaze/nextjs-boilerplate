import { HttpMethod } from '@api';
import { addUrlParams } from '@utils/url';

export interface CallApiOptions<Q extends {} = {}, B extends {} = {}> {
  /**
   * Data to pass in the query string
   */
  params?: Q;
  /**
   * Data to pass in the body
   */
  data?: B;
  /**
   * Milliseconds before timing-out (falsy or <=0 value to disable)
   * Default is 10 seconds.
   */
  timeout?: number;
}

export interface ApiResponse<R> {
  data: R;
}

type MethodOptions<
  M extends HttpMethod,
  Q extends {} = {},
  B extends {} = {}
> = CallApiOptions<Q, M extends 'GET' | 'HEAD' ? never : B>;

const defaultOptions: Partial<CallApiOptions> = {
  timeout: 10000,
};

export function callApi<
  R extends {},
  Q extends {} = {},
  B extends {} = {},
  M extends HttpMethod = HttpMethod
>(
  apiUrl: string,
  method: M,
  opt: MethodOptions<M, Q, B> = {}
): Promise<ApiResponse<R>> {
  const options = {
    ...defaultOptions,
    ...opt,
  };

  return new Promise<ApiResponse<R>>((resolve, reject) => {
    let timeoutHandler: number;
    if (options.timeout! > 0) {
      timeoutHandler = window.setTimeout(
        () => reject('timeout'),
        options.timeout!
      );
    }

    const body = options.data ? JSON.stringify(options.data) : undefined;
    let url = `/api/${apiUrl}`;

    if (!IS_PRODUCTION && url[url.length - 1] === '/') {
      // tslint:disable-next-line: no-console
      console.error(`callApi URLs shouldn't end with "/" (${apiUrl})`);
    }

    if (options.params) {
      url = addUrlParams(url, options.params);
    }

    const headers = CSRF_ENABLED
      ? {
          'Content-Type': 'application/json',
          ...getCrsfHeaders(),
        }
      : { 'Content-Type': 'application/json' };

    fetch(url, {
      method,
      body,
      headers,
    }).then((response) => {
      clearTimeout(timeoutHandler);
      resolve(response.json());
    }, reject);
  });
}

let csrfToken: string | undefined | false;
function getCrsfHeaders() {
  // when `false`, it's already been checked and there's no token defined
  if (csrfToken === false) return;

  // when `undefined`, it's still not been checked
  if (csrfToken === undefined) {
    const meta = document.head.querySelector(`[name="${CSRF_META_NAME}"]`);
    csrfToken = (meta && meta.getAttribute('content')) || false;
    meta && document.head.removeChild(meta);
    if (!csrfToken) {
      csrfToken = false;
      return;
    }
  }

  // otherwise, the token exists
  return {
    [CSRF_REQUEST_HEADER_NAME]: csrfToken,
  };
}
