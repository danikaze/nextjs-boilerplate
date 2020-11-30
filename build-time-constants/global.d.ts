/*
 * Data from global.js
 */
/** Example of a value available in the whole application */
declare const GLOBAL_EXAMPLE: string;

/**
 * - `true`: SSR is optimized delivering only the needed i18n namespaces
 * - `false`: SSG is enabled
 *
 * Currently, due to the lack of support in next-i18next for getServerSideProps
 * (https://github.com/isaachinman/next-i18next/issues/652)
 * to provide only the needed i18n namespaces (vs all of them), this is needed
 * if any of the pages use getServerSideProps fetching method
 *
 * This happen to disable Server Side Generation (SSG).
 * If you don't need getServerSideProps, or it's ok for your app to deliver
 * all the i18n namespaces at once, you can set this to `false` and recover SSG
 *
 * SSG still depends on `AUTH_ENABLED`
 */
declare const I18N_OPTIMIZED_NAMESPACES_ENABLED: boolean;

/**
 * - `true`: Enable `user` in `AppPageProps` to the user value if authenticated
 *           `false` if not logged in
 * - `false`: `user` in `AppPageProps` will still exist, but always `false`
 *
 * If you don't need authentication from server side you can set this to `false`
 * and try to enable Server Side Generation (SSG)
 *
 * SSG still depends on `ENABLE_I18N_OPTIMIZED_NAMESPACES`
 */
declare const AUTH_ENABLED: boolean;
/**
 * If `AUTH_ENABLED`, this will be the page with the login form/options
 */
declare const AUTH_LOGIN_PAGE: string;
/**
 * If `AUTH_ENABLED`, this will be the landing page after a successful login
 * attempt
 */
declare const AUTH_LOGIN_SUCCESS_PAGE: string;
/**
 * If `AUTH_ENABLED`, this will be the landing page after a failed login attempt
 * `AUTH_LOGIN_REDIRECT_PARAM` would be appended if defined as explained
 * below.
 */
declare const AUTH_LOGIN_FAIL_PAGE: string;
/**
 * If `AUTH_ENABLED`, this will be the landing page after login out
 */
declare const AUTH_LOGOUT_PAGE: string;
/**
 * If `AUTH_ENABLED`, accessing this page will clear all user credentials
 * and redirect to `AUTH_LOGOUT_PAGE`
 */
declare const AUTH_DO_LOGOUT_URL: string;
/**
 * If `AUTH_ENABLED`, when trying to access a protected page without credentials,
 * the user will be redirected to the login page. If this constant is defined to
 * a non-empty value, the original URL of the request will be appended to this
 * query parameter so the user is redirected to the original page on a
 * successfully login attempt.
 *
 * It also means it should be provided as a hidden field in the login form
 * together with the `username` and `password`, if used.
 */
declare const AUTH_LOGIN_REDIRECT_PARAM: string | undefined;
/**
 * If `AUTH_ENABLED`, this will be the page to redirect if the user is logged
 * but doesn't have enough permissions to access certain page.
 * If not defined (that is, empty string), a HTTP 401 Unauthorized error will
 * be sent
 */
declare const AUTH_FORBIDDEN_PAGE: string;

/**
 * If `AUTH_ENABLED`, this page will receive via POST `username` and `password`
 * and redirect to `AUTH_SUCCESS_PAGE` if logged in, or `AUTH_FAIL_PAGE` if not
 */
declare const AUTH_LOCAL_DO_LOGIN_URL: string;

/** Route to authenticate via Twitter (will redirect to Twitter) */
declare const AUTH_TWITTER_LOGIN_PAGE: string;

/*
 * Data from global-secret.js
 */
/** Example of a secret value available in the whole application */
declare const GLOBAL_SECRET_EXAMPLE: string;
