import { AppPage } from '@_app';
import { adminRequiredServerSideProps } from '@utils/auth';
import { Page } from '@components/page';
import { UserInfo } from '@components/user-info';

const AuthAdminPageHandler: AppPage = () => {
  const title = `${PACKAGE_NAME} - ${PACKAGE_VERSION} (${COMMIT_HASH_SHORT})`;

  return (
    <Page title={title} header="Only accessible to admins">
      <UserInfo />
    </Page>
  );
};

export const getServerSideProps = adminRequiredServerSideProps(async () => ({
  props: {},
}));

export default AuthAdminPageHandler;
