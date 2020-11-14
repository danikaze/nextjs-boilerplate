import { FunctionComponent } from 'react';

export interface Props {
  redirect?: string;
}

export const LoginForm: FunctionComponent<Props> = ({ redirect }) => {
  const redirectData = redirect ? (
    <input type="hidden" name={AUTH_LOGIN_REDIRECT_PARAM} value={redirect} />
  ) : null;

  return (
    <form action={AUTH_LOCAL_DO_LOGIN_URL} method="post">
      <div>
        <strong>Username: </strong>
        <input name="username" />
      </div>
      <div>
        <strong>Password: </strong>
        <input name="password" type="password" />
      </div>
      <div>
        {redirectData}
        <input type="submit" value="Log In" />
      </div>
    </form>
  );
};
