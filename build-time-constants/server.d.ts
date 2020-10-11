/*
 * Data from server.js
 */
/**
 * Default port to run NextJs server on if not specified by process.env.PORT
 */
declare const SERVER_DEFAULT_PORT: number;
/**
 * As per #8251 (https://github.com/vercel/next.js/issues/8251)
 * __dirname is not working, so this can be used as a workaround
 */
declare const PROJECT_ROOT: string;
/**
 * Absolute path to the locales folder
 */
declare const LOCALES_PATH: string;

/*
 * Data from server-secret.js
 */
/** Example of a secret value available for the server-side code */
declare const SERVER_SECRET_EXAMPLE: string;
