import { AppProps } from 'next/dist/next-server/lib/router/router';
import '@styles/globals.css';

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  return <Component {...pageProps} />;
};

export default App;
