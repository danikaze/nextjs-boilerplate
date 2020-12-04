import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ExampleNavBar } from '@components/example-nav-bar';
import { UserInfo } from '@components/user-info';
import styles from '@styles/Home.module.css';
import { logoutRequired } from '@utils/auth';
import { AppPage } from './_app';

const Logout: AppPage = () => {
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
          <h3>Logged out</h3>
          <UserInfo />
        </main>
        <div>PRODUCTION: {IS_PRODUCTION ? 'true' : 'false'}</div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  logoutRequired(ctx);

  return {
    props: {
      user: false,
    },
  };
};

export default Logout;
