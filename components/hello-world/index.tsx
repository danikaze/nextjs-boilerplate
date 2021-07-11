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
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';
import { useTranslation } from 'next-i18next';

export interface Props {
  saluteWho?: string;
  count: number;
  locale: AvailableLocale;
  locales: AvailableLocale[];
  onIncrease: () => void;
  onDecrease: () => void;
  onLangChang: (lang: AvailableLocale) => void;
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
  locale,
  locales,
  onIncrease,
  onDecrease,
  onLangChang,
}) => {
  const languageChange: SelectInputProps['onChange'] = (event) => {
    onLangChang(event.target.value as AvailableLocale);
  };
  const { t } = useTranslation('hello-world');
  const langItems = locales.map((lang) => (
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
          <Select defaultValue={locale} onChange={languageChange}>
            {langItems}
          </Select>
        </div>
        <Typography>{t('localizedText')}</Typography>
      </StyledCardContent>
    </Card>
  );
};

HelloWorld.defaultProps = {
  saluteWho: 'world',
};
