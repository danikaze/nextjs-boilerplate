import { ParsedUrlQuery } from 'querystring';
import React, { ComponentType, FunctionComponent, useEffect } from 'react';
import {
  GetServerSidePropsContext as GSSPCtx,
  GetServerSidePropsResult,
  NextComponentType,
  NextPage,
} from 'next';
import NextApp, { AppContext, AppProps as NextAppProps } from 'next/app';
import Head from 'next/head';
import { appWithTranslation } from '@utils/i18n';
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
  namespacesRequired?: string[];
  logger: NsLogger;
}

export type GetServerSidePropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = GSSPCtx<Q> & {
  req: { user: UserAuthData | false };
};

export type GetServerSideProps<
  // tslint:disable-next-line:no-any
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends {} = {}
> = (
  context: GetServerSidePropsContext<Q & ParsedUrlQuery>
) => Promise<GetServerSidePropsResult<P>>;

export type AppType = FunctionComponent<NextAppProps<AppPageProps>> & {
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

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <meta name="theme-color" content={theme.palette.primary.main} />
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
 * 2. Apply i18n
 * 3. Apply auth
 */
let ExportedApp = App as AppType;

if (REDUX_ENABLED) {
  ExportedApp = require('@store').store.withRedux(App) as AppType;
}

if (I18N_OPTIMIZED_NAMESPACES_ENABLED && !AUTH_ENABLED) {
  ExportedApp.getInitialProps = async (appContext: AppContext) => {
    const appProps = await NextApp.getInitialProps(appContext);
    const defaultProps = (appContext.Component as AppPage).defaultProps || {};
    const pageProps = {
      ...defaultProps,
    };

    return {
      ...appProps,
      pageProps: {
        ...appProps.pageProps,
        ...pageProps,
      },
    };
  };
}

if (AUTH_ENABLED) {
  ExportedApp = appWithAuth(ExportedApp as ComponentType);
}

ExportedApp = appWithTranslation(ExportedApp as AppType);

export default ExportedApp;
