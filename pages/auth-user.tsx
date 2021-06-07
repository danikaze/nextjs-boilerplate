import { AppPage } from './_app';
import { userRequiredServerSideProps } from '@utils/auth';
import { Page } from '@components/page';
import { UserInfo } from '@components/user-info';

const AuthUserPageHandler: AppPage = () => {
  const title = `${PACKAGE_NAME} - ${PACKAGE_VERSION} (${COMMIT_HASH_SHORT})`;

  return (
    <Page title={title} header="Only accessible to users">
      <UserInfo />
    </Page>
  );
};

export const getServerSideProps = userRequiredServerSideProps(async () => ({
  props: {},
}));

export default AuthUserPageHandler;
