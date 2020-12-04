import { FunctionComponent } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { userSelector } from '@store/model/user/selectors';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(),
  },
}));

export const ExampleNavBar: FunctionComponent = () => {
  const classes = useStyles();
  const isLoggedIn = useSelector(userSelector);

  const LoginLink = isLoggedIn ? (
    <Link href="/logout">
      <a className={classes.link}>
        <Typography variant="h6">Logout</Typography>
      </a>
    </Link>
  ) : (
    <Link href="/login">
      <a className={classes.link}>
        <Typography variant="h6">Login</Typography>
      </a>
    </Link>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/">
            <a className={classes.link}>
              <Typography variant="h6">Index</Typography>
            </a>
          </Link>
          <Link href="/auth">
            <a className={classes.link}>
              <Typography variant="h6">User info</Typography>
            </a>
          </Link>
          <Link href="/auth-user">
            <a className={classes.link}>
              <Typography variant="h6">Only user</Typography>
            </a>
          </Link>
          <Link href="/auth-admin">
            <a className={classes.link}>
              <Typography variant="h6">Only admin</Typography>
            </a>
          </Link>
          {LoginLink}
        </Toolbar>
      </AppBar>
    </div>
  );
};
