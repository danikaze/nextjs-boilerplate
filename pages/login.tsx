import { AppPage } from './_app';
import { LoginPage, Props } from '@page-components/login';

const LoginPageHandler: AppPage<Props, Props> = (props) => {
  return <LoginPage {...props} />;
};

LoginPageHandler.defaultProps = {
  namespacesRequired: ['login'],
};

LoginPageHandler.getInitialProps = (ctx) => {
  return {
    redirect: ctx.query.r as string | undefined,
  };
};

export default LoginPageHandler;
