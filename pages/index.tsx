import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AppPage } from '@_app';
import { getServerSidePropsWithCsrf } from '@utils/api/csrf';
import { IndexPage, Props } from '@page-components/index';
import { store } from '@store';
import { setCount } from '@store/actions/counter';

const IndexPageHandler: AppPage<Props> = ({ logger }) => {
  logger.info('Page rendered');

  return <IndexPage />;
};

// initialize the store depending on request data
export const getServerSideProps = store.getServerSideProps<Props>((store) =>
  // provide a csrf token for the page (used by callApi)
  getServerSidePropsWithCsrf(async ({ query, locale }) => {
    const n = Number(query?.n);
    if (!isNaN(n)) {
      store.dispatch(setCount(n));
    }

    return {
      props: {
        ...(await serverSideTranslations(locale!, ['hello-world'])),
      },
    };
  })
);

export default IndexPageHandler;
