import React, { FunctionComponent, useEffect } from 'react';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import Head from 'next/Head';
import { store } from '@store';

import '@styles/globals.css';
import { theme } from '@themes';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
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

export default store.withRedux(App);
