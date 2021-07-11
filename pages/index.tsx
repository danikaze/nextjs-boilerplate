import { AppPage } from '@_app';
import { IndexPage, Props } from '@page-components/index';
import { store } from '@store';
import { setCount } from '@store/actions/counter';

const IndexPageHandler: AppPage<Props> = ({ logger }) => {
  logger.info('Page rendered');

  return <IndexPage />;
};

IndexPageHandler.defaultProps = {
  namespacesRequired: ['hello-world'],
};

// initialize the store depending on request data
export const getServerSideProps = store.getServerSideProps<Props>(
  (store) => async (ctx) => {
    const n = Number(ctx.query?.n);
    if (!isNaN(n)) {
      store.dispatch(setCount(n));
    }

    return {
      props: {},
    };
  }
);

export default IndexPageHandler;
