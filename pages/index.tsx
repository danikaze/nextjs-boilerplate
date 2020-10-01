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
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>{helloWorld}</main>
    </div>
  );
};

export default Home;
