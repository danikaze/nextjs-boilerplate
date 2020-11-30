/*
 * Data from the build, only available to the server
 */
/**
 * As per #8251 (https://github.com/vercel/next.js/issues/8251)
 * __dirname is not working, so this can be used as a workaround
 */
declare const PROJECT_ROOT: string;
/** Absolute path to the locales folder */
declare const LOCALES_PATH: string;

/*
 * Data from server.js
 */
/**
 * Default port to run NextJs server on if not specified by process.env.PORT
 */
declare const SERVER_DEFAULT_PORT: number;

/** Callback for twitter authentication strategy */
declare const AUTH_TWITTER_CALLBACK_ABS_URL: string;

/*
 * Data from server-secret.js
 */
/** Twitter API key used for authentication */
declare const AUTH_TWITTER_API_KEY: string;
/** Twitter API key secret used for authentication */
declare const AUTH_TWITTER_API_KEY_SECRET: string;
