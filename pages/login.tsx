import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AppPage, GetServerSideProps } from '@_app';
import { LoginPage, Props } from '@page-components/login';

const LoginPageHandler: AppPage<Props, Props> = (props) => {
  return <LoginPage {...props} />;
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  return {
    redirect: query.r as string | undefined,
    props: {
      ...(await serverSideTranslations(locale!, ['login'])),
    },
  };
};

export default LoginPageHandler;
