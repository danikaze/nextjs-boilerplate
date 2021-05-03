import Head from 'next/head';
import { ExampleNavBar } from '@components/example-nav-bar';
import { UserInfo } from '@components/user-info';
import { userRequiredServerSideProps } from '@utils/auth';
import styles from '@styles/Home.module.css';
import { AppPage } from './_app';

const Auth: AppPage = () => {
  return (
    <>
      <ExampleNavBar />
      <div className={styles.container}>
        <Head>
          <title>
            {PACKAGE_NAME} - {PACKAGE_VERSION} ({COMMIT_HASH_SHORT})
          </title>
        </Head>

        <main className={styles.main}>
          <h3>Only accesible to users</h3>
          <UserInfo />
        </main>
        <div>PRODUCTION: {IS_PRODUCTION ? 'true' : 'false'}</div>
      </div>
    </>
  );
};

export const getServerSideProps = userRequiredServerSideProps({}, async () => ({
  props: {},
}));

export default Auth;
