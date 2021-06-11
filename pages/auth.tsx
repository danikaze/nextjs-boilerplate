import { AppPage } from '@_app';
import { Page } from '@components/page';
import { UserInfo } from '@components/user-info';

const AuthPageHandler: AppPage = () => {
  const title = `${PACKAGE_NAME} - ${PACKAGE_VERSION} (${COMMIT_HASH_SHORT})`;

  return (
    <Page title={title} header="Accessible to everyone">
      <UserInfo />
    </Page>
  );
};

export default AuthPageHandler;
