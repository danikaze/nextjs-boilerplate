import { FunctionComponent } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from '@utils/i18n';
import { Twitter } from '@components/icons/twitter';

export interface Props {
  redirect?: string;
  twitter?: boolean;
}

const useStyles = makeStyles((theme) => ({
  withTopMargin: {
    marginTop: theme.spacing(),
  },
  withFullMargin: {
    margin: theme.spacing(),
  },
  center: {
    textAlign: 'center',
  },
}));

export const LoginForm: FunctionComponent<Props> = ({ redirect, ...icons }) => {
  const classes = useStyles();
  const { t } = useTranslation('login');

  const redirectData = redirect ? (
    <input type="hidden" name={AUTH_LOGIN_REDIRECT_PARAM} value={redirect} />
  ) : null;

  return (
    <form action={AUTH_LOCAL_DO_LOGIN_URL} method="post">
      <Card>
        <CardContent>
          <Typography variant="h5">{t('loginTitle')}</Typography>
          <div className={classes.withTopMargin}>
            <TextField label={t('username')} name="username" fullWidth={true} />
          </div>
          <div className={classes.withTopMargin}>
            <TextField
              label={t('password')}
              name="password"
              type="password"
              fullWidth={true}
              autoComplete="off"
            />
          </div>
        </CardContent>
        <CardActions>
          {redirectData}
          <Button
            type="submit"
            fullWidth={true}
            color="primary"
            variant="contained"
          >
            {t('signInButton')}
          </Button>
        </CardActions>
        {getIcons(icons)}
      </Card>
    </form>
  );
};

function getIcons(icons: Omit<Props, 'redirect'>): JSX.Element | null {
  const { t } = useTranslation('login');
  const classes = useStyles();
  const list: JSX.Element[] = [];

  if (AUTH_TWITTER_LOGIN_PAGE && icons.twitter) {
    list.push(
      <Link
        key="twitter"
        title={t('signInWithTwitter')}
        href={AUTH_TWITTER_LOGIN_PAGE}
      >
        <Twitter fontSize="large" />
      </Link>
    );
  }

  if (list.length === 0) return null;

  return (
    <div className={classes.withFullMargin}>
      <Typography>{t('signInWithService')}</Typography>
      <div className={classes.center}>{list}</div>
    </div>
  );
}
