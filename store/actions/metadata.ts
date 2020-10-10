import { ThunkActionCreator } from '@store';
import { AppAction } from '.';
import { Lang } from '@store/model/metadata';
import { changeLang, getCurrentLang } from '@utils/i18n';

export type MetadataAction = SetLangAction;

export interface SetLangAction extends AppAction {
  type: 'SET_LANG';
  payload: Lang;
}

export const setLang: ThunkActionCreator<SetLangAction> = (lang: Lang) => (
  dispatch
) => {
  changeLang(lang).then(() => {
    dispatch({
      type: 'SET_LANG',
      payload: lang,
    });
  });
};
