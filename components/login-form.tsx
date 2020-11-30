import { FunctionComponent } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from '@utils/i18n';

export interface Props {
  redirect?: string;
}

const useStyles = makeStyles((theme) => ({
  withTopMargin: {
    marginTop: theme.spacing(),
  },
}));

export const LoginForm: FunctionComponent<Props> = ({ redirect }) => {
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
      </Card>
    </form>
  );
};
