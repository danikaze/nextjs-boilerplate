import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { userRequired } from '@utils/auth';
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
    <div className={styles.container}>
      <Head>
        <title>
          {PACKAGE_NAME} - {PACKAGE_VERSION} ({COMMIT_HASH_SHORT})
        </title>
      </Head>

      <main className={styles.main}>
        <h3>Only accesible to users</h3>
        {info}

        <div>
          <Link href="/auth">
            <a>[all]</a>
          </Link>
          <Link href="/auth-user">
            <a>[user only]</a>
          </Link>
          <Link href="/auth-admin">
            <a>[admin only]</a>
          </Link>
        </div>
      </main>
      <div>PRODUCTION: {IS_PRODUCTION ? 'true' : 'false'}</div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  userRequired(ctx);
  return { props: {} };
};

export default Auth;
