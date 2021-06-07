import { FC } from 'react';
import { Page } from '@components/page';
import { LoginForm } from '@components/login-form';

export interface Props {
  redirect?: string;
}

export const LoginPage: FC<Props> = ({ redirect }) => {
  const title = `${PACKAGE_NAME} - ${PACKAGE_VERSION} (${COMMIT_HASH_SHORT})`;

  return (
    <Page title={title} header="Login">
      <LoginForm redirect={redirect} twitter />
    </Page>
  );
};
