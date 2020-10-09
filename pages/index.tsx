import Head from 'next/head';
import { NextPage } from 'next';
import { HelloWorld } from '@components/hello-world';
import { testUtil } from '@utils/test';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '@store';
import { counterSelector } from '@store/model/counter/selectors';
import { decreaseCount, increaseCount, setCount } from '@store/actions/counter';

import styles from '@styles/Home.module.css';

function usePage() {
  const dispatch = useDispatch();

  return {
    count: useSelector(counterSelector),
    increase: () => dispatch(increaseCount()),
    decrease: () => dispatch(decreaseCount()),
  };
}

const Home: NextPage = () => {
  const helloWorld = testUtil(false) ? (
    <HelloWorld />
  ) : (
    <HelloWorld saluteWho="you" />
  );

  const { count, increase, decrease } = usePage();

  return (
    <div className={styles.container}>
      <Head>
        <title>
          {PACKAGE_NAME} - {PACKAGE_VERSION} ({COMMIT_HASH_SHORT})
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3>{helloWorld}</h3>
        <p>
          <span
            onClick={decrease}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            ⊖
          </span>
          {` `}[{count}]{` `}
          <span
            onClick={increase}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            ⊕
          </span>
        </p>
      </main>
      <div>PRODUCTION: {IS_PRODUCTION ? 'true' : 'false'}</div>
    </div>
  );
};

// initialize the store depending on request data
export const getServerSideProps = store.getServerSideProps((ctx) => {
  const n = Number(ctx.query?.n);
  if (!isNaN(n)) {
    ctx.store.dispatch(setCount(n));
  }
});

export default Home;
