import { useSelector } from 'react-redux';
import Head from 'next/Head';
import Link from 'next/link';
import styles from '@styles/Home.module.css';
import { userSelector } from '@store/model/user/selectors';
import { AppPage } from './_app';

const Auth: AppPage = () => {
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
    <div className={styles.container}>
      <Head>
        <title>
          {PACKAGE_NAME} - {PACKAGE_VERSION} ({COMMIT_HASH_SHORT})
        </title>
      </Head>

      <main className={styles.main}>
        <h3>Accessible to everyone</h3>
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

export default Auth;