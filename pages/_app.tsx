import React, { FunctionComponent, useEffect } from 'react';
import { NextComponentType, NextPage } from 'next';
import NextApp, { AppContext, AppProps as NextAppProps } from 'next/app';
import Head from 'next/Head';
import { store } from '@store';
import { appWithTranslation } from '@utils/i18n';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { theme } from '@themes';

import '@styles/globals.css';

export type AppPage<P = {}, IP = P> = NextPage<
  P & WithI18nNamespaces,
  IP & WithI18nNamespaces
>;
interface WithI18nNamespaces {
  namespacesRequired?: string[];
}
interface WithInitialProps {
  getInitialProps?: NextComponentType<AppContext>['getInitialProps'];
}

const App: FunctionComponent<NextAppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentElement!.removeChild(jssStyles);
  }, []);

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

/*
 * Order of HOC matters
 * 1. Apply redux
 * 2. Apply i18n
 */

const ReduxApp = store.withRedux(App) as WithInitialProps;

if (ENABLE_I18N_OPTIMIZED_NAMESPACES) {
  ReduxApp.getInitialProps = async (appContext: AppContext) => {
    const appProps = await NextApp.getInitialProps(appContext);
    const defaultProps = (appContext.Component as AppPage).defaultProps || {};

    return {
      ...appProps,
      pageProps: {
        ...defaultProps,
      },
    };
  };
}

export default appWithTranslation(ReduxApp as FunctionComponent<NextAppProps>);
