import Head from 'next/head';
import { NextPage } from 'next';
import styles from '@styles/Home.module.css';
import { HelloWorld } from '@components/hello-world';
import { testUtil } from '@utils/test';

const Home: NextPage = () => {
  const helloWorld = testUtil(false) ? (
    <HelloWorld />
  ) : (
    <HelloWorld saluteWho="you" />
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>
          {PACKAGE_NAME} - {PACKAGE_VERSION} ({COMMIT_HASH_SHORT})
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>{helloWorld}</main>
      <div>PRODUCTION: {IS_PRODUCTION ? 'true' : 'false'}</div>
    </div>
  );
};

export default Home;
