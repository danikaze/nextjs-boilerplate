import { AppPage } from '@_app';
import { logoutRequiredServerSideProps } from '@utils/auth';
import { LogoutPage, Props } from '@page-components/logout';

const LogoutPageHandler: AppPage<Props> = () => {
  return <LogoutPage />;
};

export const getServerSideProps = logoutRequiredServerSideProps(async () => ({
  props: {},
}));

export default LogoutPageHandler;
