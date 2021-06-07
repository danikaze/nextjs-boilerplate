import { FunctionComponent } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { useUserData } from '@utils/auth';
import styles from './user-info.module.scss';

export const UserInfo: FunctionComponent = () => {
  const user = useUserData();
  const isLoggedIn = !!user;
  const data = [['Logged in', isLoggedIn ? 'true' : 'false']];

  if (user) {
    data.push(['username', user.username], ['role', user.role]);
  }

  const info = data.map((item, i) => (
    <Typography key={i}>
      <strong>{item[0]}: </strong>
      {item[1]}
    </Typography>
  ));

  return (
    <Card className={styles[`logged-${isLoggedIn}`]}>
      <CardContent>{info}</CardContent>
    </Card>
  );
};
