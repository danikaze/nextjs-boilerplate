import { FunctionComponent } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Theme,
  IconButton,
  Select,
  MenuItem,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons';
import { Lang, useTranslation } from '@utils/i18n';
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';

export interface Props {
  saluteWho?: string;
  count: number;
  langList: Lang[];
  currentLang: Lang;
  onIncrease: () => void;
  onDecrease: () => void;
  onLangChang: (lang: Lang) => void;
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
  langList,
  currentLang,
  onIncrease,
  onDecrease,
  onLangChang,
}) => {
  const languageChange: SelectInputProps['onChange'] = (event) => {
    onLangChang(event.target.value as Lang);
  };
  const { t } = useTranslation('hello-world');
  const langItems = langList.map((lang) => (
    <MenuItem key={lang} value={lang}>
      {lang}
    </MenuItem>
  ));

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
        <div>
          <Select defaultValue={currentLang} onChange={languageChange}>
            {langItems}
          </Select>
          <Typography>{t('localizedText')}</Typography>
        </div>
      </StyledCardContent>
    </Card>
  );
};

HelloWorld.defaultProps = {
  saluteWho: 'world',
};
