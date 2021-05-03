import { ParsedUrlQuery } from 'querystring';
import { IncomingMessage } from 'http';
import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  GetServerSidePropsContext as GSSPCtx,
  GetServerSidePropsResult,
  NextComponentType,
  NextPage,
} from 'next';
import NextApp, { AppContext, AppProps as NextAppProps } from 'next/app';
import Head from 'next/head';
import { store } from '@store';
import { appWithTranslation } from '@utils/i18n';
import { useUserData } from '@utils/auth';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { getLogger, globalLogger, Logger, NsLogger } from '@utils/logger';
import { theme } from '@themes';
import { UserAuthData } from '@model/user';
import { setUser } from '@store/actions/user';

import '@styles/globals.css';

export type AppPage<P = {}, IP = P> = NextPage<P & AppPageProps, IP>;
interface AppPageProps {
  namespacesRequired?: string[];
  logger: NsLogger;
  user: UserAuthData | false;
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

interface WithInitialProps {
  getInitialProps?: NextComponentType<AppContext>['getInitialProps'];
}

interface AuthRequest extends IncomingMessage {
  session?: {
    passport: {
      user: UserAuthData | false;
    };
  };
}

const App: FunctionComponent<NextAppProps<AppPageProps>> = ({
  Component,
  pageProps,
}) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentElement!.removeChild(jssStyles);
  }, []);

  const loggerNamespace = `${Component.displayName || Component.name}Page`;
  (pageProps as AppPageProps).logger = getLogger(loggerNamespace);

  if (AUTH_ENABLED) {
    initUserForClientSideNavigation(pageProps);
  }

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
 */

const ReduxApp = store.withRedux(App) as WithInitialProps;

if (I18N_OPTIMIZED_NAMESPACES_ENABLED || AUTH_ENABLED) {
  ReduxApp.getInitialProps = async (appContext: AppContext) => {
    const appProps = await NextApp.getInitialProps(appContext);
    const defaultProps = (appContext.Component as AppPage).defaultProps || {};
    const pageProps = {
      ...defaultProps,
    };

    if (AUTH_ENABLED) {
      const req = appContext.ctx.req as AuthRequest;
      pageProps.user =
        (req &&
          req.session &&
          req.session.passport &&
          req.session.passport.user) ||
        false;
    } else {
      pageProps.user = false;
    }

    return {
      ...appProps,
      pageProps: {
        ...appProps.pageProps,
        ...pageProps,
      },
    };
  };
}

export default appWithTranslation(ReduxApp as FunctionComponent<NextAppProps>);

/**
 * User data from passport only is available when rendering from server side
 * meaning that when navigating in client side (no page reload with Next JS)
 * we won't have the user data available from the request.
 * This sets the user data from the request into the redux Store and the next
 * requests will just get it from there
 */
function initUserForClientSideNavigation(pageProps: AppPageProps): void {
  const dispatch = useDispatch();
  const user = useUserData();

  // user data was already in the State which means this is client navigation
  // just copy the data from the state into the page initial props, so it's
  // available (although it's better to get it via `useSelector(userSelector))`
  // in case anything is updated
  if (user) {
    pageProps.user = user;
    return;
  }

  // if the user data was not in the State, it means it was not logged in, or
  // it was logged in but page is being rendered in server side, therefore we
  // just put it into the state
  if (pageProps.user) {
    dispatch(setUser(pageProps.user));
  }
}
