import { FC } from 'react';
import { Page } from '@components/page';
import { UserInfo } from '@components/user-info';

export type Props = {};

export const LogoutPage: FC<Props> = () => {
  const title = `${PACKAGE_NAME} - ${PACKAGE_VERSION} (${COMMIT_HASH_SHORT})`;

  return (
    <Page title={title} header="Logged-out">
      <UserInfo />
    </Page>
  );
};
