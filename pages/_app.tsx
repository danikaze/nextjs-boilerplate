import { FunctionComponent } from 'react';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import { store } from '@store';

import '@styles/globals.css';

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default store.withRedux(App);
