import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { adminRequired } from '@utils/auth';
import { ExampleNavBar } from '@components/example-nav-bar';
import styles from '@styles/Home.module.css';
import { AppPage } from './_app';

const Auth: AppPage = ({ user }) => {
  const data = [
    [
      'Logged in',
      user ? (
        <>
          true {'> '}
          <Link href="logout">
            <a>Logout</a>
          </Link>
        </>
      ) : (
        <>
          false {'> '}
          <Link href="login">
            <a>Login</a>
          </Link>
        </>
      ),
    ],
  ];

  if (user) {
    data.push(['username', user.username], ['role', user.role]);
  }
  const info = data.map((item, i) => (
    <div key={i}>
      <strong>{item[0]}: </strong>
      {item[1]}
    </div>
  ));

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
          <h3>Only accesible to admins</h3>
          {info}
        </main>
        <div>PRODUCTION: {IS_PRODUCTION ? 'true' : 'false'}</div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  adminRequired(ctx);
  return { props: {} };
};

export default Auth;
