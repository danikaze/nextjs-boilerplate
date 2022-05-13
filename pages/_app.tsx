import { ParsedUrlQuery } from 'querystring';
import React, { ComponentType, useEffect } from 'react';
import {
  GetServerSidePropsContext as GSSPCtx,
  GetServerSidePropsResult,
  NextComponentType,
  NextPage,
} from 'next';
import { AppContext, AppProps as NextJsAppProps } from 'next/app';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';
import { appWithAuth } from '@utils/auth';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { getLogger, globalLogger, Logger, NsLogger } from '@utils/logger';
import { theme } from '@themes';
import { UserAuthData } from '@model/user';

import '@styles/reset-v2.css';
import '@styles/globals.css';

export type AppPage<P = {}, IP = P> = NextPage<P & AppPageProps, IP>;
interface AppPageProps {
  logger: NsLogger;
  csrfToken?: string;
}

export type GetServerSidePropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = GSSPCtx<Q> & {
  req: {
    user: UserAuthData | false;
    csrfToken?: () => string;
  };
};

export type GetServerSideProps<
  // tslint:disable-next-line:no-any
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends {} = {}
> = (
  context: GetServerSidePropsContext<Q & ParsedUrlQuery>
) => Promise<GetServerSidePropsResult<P>>;

export type AppType = ComponentType<NextJsAppProps<AppPageProps>> & {
  csrfToken?: string;
  getInitialProps?: NextComponentType<AppContext>['getInitialProps'];
};

const App: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentElement!.removeChild(jssStyles);
  }, []);

  const loggerNamespace = `${Component.displayName || Component.name}Page`;
  (pageProps as AppPageProps).logger = getLogger(loggerNamespace);

  const csrfMeta = CSRF_ENABLED && pageProps.csrfToken && (
    <meta name={CSRF_META_NAME} content={pageProps.csrfToken} />
  );

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <meta name="theme-color" content={theme.palette.primary.main} />
        {csrfMeta}
      </Head>
      <Logger.Provider value={globalLogger}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </Logger.Provider>
    </>
  );
};

/*
 * Order of HOC matters
 * 1. Apply redux
 * 2. Apply auth
 * 3. Apply i18n
 */
let ExportedApp = App as AppType;

if (REDUX_ENABLED) {
  ExportedApp = require('@store').store.withRedux(App) as AppType;
}

if (AUTH_ENABLED) {
  ExportedApp = appWithAuth(ExportedApp as ComponentType);
}

if (I18N_ENABLED) {
  // tslint:disable-next-line:no-any
  ExportedApp = appWithTranslation(ExportedApp as any) as AppType;
}

export default ExportedApp;
