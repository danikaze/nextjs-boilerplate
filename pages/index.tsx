import { AppPage } from '@_app';
import { IndexPage, Props } from '@page-components/index';
import { store } from '@store';
import { setCount } from '@store/actions/counter';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const IndexPageHandler: AppPage<Props> = ({ logger }) => {
  logger.info('Page rendered');

  return <IndexPage />;
};

// initialize the store depending on request data
export const getServerSideProps = store.getServerSideProps<Props>(
  (store) => async ({ query, locale }) => {
    const n = Number(query?.n);
    if (!isNaN(n)) {
      store.dispatch(setCount(n));
    }

    return {
      props: {
        ...(await serverSideTranslations(locale!, ['hello-world'])),
      },
    };
  }
);

export default IndexPageHandler;
