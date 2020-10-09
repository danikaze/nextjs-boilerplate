import { FunctionComponent } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Theme,
  IconButton,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons';

export interface Props {
  saluteWho?: string;
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const StyledCardContent = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.info.main,
  },
}))(CardContent);

const Count = withStyles({
  root: {
    fontWeight: 'bold',
  },
})(Typography);

export const HelloWorld: FunctionComponent<Props> = ({
  saluteWho,
  count,
  onIncrease,
  onDecrease,
}) => {
  return (
    <Card>
      <StyledCardContent>
        <Typography>Hello {saluteWho}</Typography>
        <div>
          <IconButton onClick={onDecrease} component="span">
            <RemoveCircleOutline />
          </IconButton>
          <Count display="inline">{count}</Count>
          <IconButton onClick={onIncrease} component="span">
            <AddCircleOutline />
          </IconButton>
        </div>
      </StyledCardContent>
    </Card>
  );
};

HelloWorld.defaultProps = {
  saluteWho: 'world',
};
