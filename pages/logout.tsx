import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { ExampleNavBar } from '@components/example-nav-bar';
import styles from '@styles/Home.module.css';
import { userSelector } from '@store/model/user/selectors';
import { logoutRequired } from '@utils/auth';
import { AppPage } from './_app';

const Logout: AppPage = () => {
  const user = useSelector(userSelector);
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
          <h3>Logged out</h3>
          {info}
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
