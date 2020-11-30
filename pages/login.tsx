import Head from 'next/Head';
import styles from '@styles/Home.module.css';
import { LoginForm } from '@components/login-form';
import { AppPage } from './_app';

export interface Props {
  redirect?: string;
}

const Login: AppPage<Props, Props> = ({ redirect }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>
          {PACKAGE_NAME} - {PACKAGE_VERSION} ({COMMIT_HASH_SHORT})
        </title>
      </Head>

      <main className={styles.main}>
        <LoginForm redirect={redirect} twitter />
      </main>
      <div>PRODUCTION: {IS_PRODUCTION ? 'true' : 'false'}</div>
    </div>
  );
};

Login.defaultProps = {
  namespacesRequired: ['login'],
};

Login.getInitialProps = (ctx) => {
  return {
    redirect: ctx.query.r as string | undefined,
  };
};

export default Login;
