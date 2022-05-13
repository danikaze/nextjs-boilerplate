import { FunctionComponent, ReactNode, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { callJokesApi } from '@api/jokes/client';

const useStyles = makeStyles((theme) => {
  const GREY_TONE = 400;
  return {
    note: {
      fontSize: 'smaller',
    },
    link: {
      color: theme.palette.info.main,
    },
    joke: {
      marginTop: theme.spacing(),
      paddingTop: theme.spacing(),
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderTopColor: theme.palette.grey[GREY_TONE],
      color: theme.palette.primary.main,
    },
  };
});

type Styles = ReturnType<typeof useStyles>;

export const Joke: FunctionComponent = () => {
  const styles = useStyles();
  const [joke, setJoke] = useState<string | undefined>(undefined);

  async function updateJoke() {
    try {
      const newJoke = await callJokesApi();
      setJoke(newJoke);
    } catch (e) {
      setJoke('Error retrieving the joke');
    }
  }

  return (
    <Card>
      <CardContent>
        <Button onClick={updateJoke}>Get new joke</Button>
        <Typography className={styles.note}>
          Accessing the{' '}
          <a className={styles.link} href="/api/jokes">
            API directly
          </a>{' '}
          (without the CSRF token) should be forbidden when{' '}
          <strong>CSRF_ENABLED</strong> is true
        </Typography>
        {renderJoke(styles, joke)}
      </CardContent>
    </Card>
  );
};

function renderJoke(styles: Styles, joke: string | undefined): ReactNode {
  if (!joke) return null;

  const lines = joke
    .split('\n')
    .map((line, i) => <Typography key={i}>{line.trim()}</Typography>);

  return <div className={styles.joke}>{lines}</div>;
}
