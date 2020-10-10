import { AppPage } from './_app';
import Head from 'next/Head';
import { HelloWorld, Props as HelloWorldProps } from '@components/hello-world';
import { testUtil } from '@utils/test';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '@store';
import { counterSelector } from '@store/model/counter/selectors';
import { decreaseCount, increaseCount, setCount } from '@store/actions/counter';
import { setLang } from '@store/actions/metadata';
import { Lang } from '@store/model/metadata';

import styles from '@styles/Home.module.css';
import { getLanguage } from '@store/model/metadata/selectors';
import { availableLangs } from '@utils/i18n';

function usePage() {
  const dispatch = useDispatch();

  return {
    count: useSelector(counterSelector),
    currentLang: useSelector(getLanguage),
    langList: availableLangs(),
    increase: () => dispatch(increaseCount()),
    decrease: () => dispatch(decreaseCount()),
    changeLang: (lang: Lang) => dispatch(setLang(lang)),
  };
}

const Home: AppPage = () => {
  const {
    count,
    increase,
    decrease,
    currentLang,
    langList,
    changeLang,
  } = usePage();

  const props: HelloWorldProps = {
    count,
    currentLang,
    langList,
    onIncrease: increase,
    onDecrease: decrease,
    onLangChang: changeLang,
  };

  if (testUtil(true)) {
    props.saluteWho = 'you';
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>
          {PACKAGE_NAME} - {PACKAGE_VERSION} ({COMMIT_HASH_SHORT})
        </title>
      </Head>

      <main className={styles.main}>
        <HelloWorld {...props} />
      </main>
      <div>PRODUCTION: {IS_PRODUCTION ? 'true' : 'false'}</div>
    </div>
  );
};

Home.defaultProps = {
  namespacesRequired: ['hello-world'],
};

// initialize the store depending on request data
export const getServerSideProps = store.getServerSideProps((ctx) => {
  const n = Number(ctx.query?.n);
  if (!isNaN(n)) {
    ctx.store.dispatch(setCount(n));
  }
});

export default Home;
