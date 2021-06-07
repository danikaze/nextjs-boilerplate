import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentLanguage,
  availableLangs,
  Lang,
  changeLang,
} from '@utils/i18n';
import { increaseCount, decreaseCount } from '@store/actions/counter';
import { counterSelector } from '@store/model/counter/selectors';

export function useIndexPage() {
  const dispatch = useDispatch();

  return {
    count: useSelector(counterSelector),
    currentLang: getCurrentLanguage(),
    langList: availableLangs(),
    increase: () => dispatch(increaseCount()),
    decrease: () => dispatch(decreaseCount()),
    changeLang: (lang: Lang) => changeLang(lang), //dispatch(setLang(lang)),
  };
}
