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
 */
declare const ENABLE_I18N_OPTIMIZED_NAMESPACES: boolean;

/*
 * Data from global-secret.js
 */
/** Example of a secret value available in the whole application */
declare const GLOBAL_SECRET_EXAMPLE: string;
