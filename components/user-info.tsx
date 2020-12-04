import { FunctionComponent } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { useUserData } from '@utils/auth';

export const UserInfo: FunctionComponent = () => {
  const user = useUserData();
  const data = [['Logged in', user ? 'true' : 'false']];

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
    <Card>
      <CardContent>{info}</CardContent>
    </Card>
  );
};
