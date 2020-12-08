import { AppPage } from './_app';
import Head from 'next/head';
import { HelloWorld, Props as HelloWorldProps } from '@components/hello-world';
import { ExampleNavBar } from '@components/example-nav-bar';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '@store';
import { counterSelector } from '@store/model/counter/selectors';
import { decreaseCount, increaseCount, setCount } from '@store/actions/counter';
import {
  Lang,
  availableLangs,
  changeLang,
  getCurrentLanguage,
} from '@utils/i18n';
import styles from '@styles/Home.module.css';

function usePage() {
  const dispatch = useDispatch();

  return {
    count: useSelector(counterSelector),
    currentLang: getCurrentLanguage(),
    langList: availableLangs(),
    increase: () => dispatch(increaseCount()),
    decrease: () => dispatch(decreaseCount()),
    changeLang: (lang: Lang) => changeLang(lang), //dispatch(setLang(lang)),
  };
}

const Home: AppPage = ({ logger }) => {
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

  logger.info('Page rendered');

  return (
    <>
      <ExampleNavBar />
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
    </>
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
