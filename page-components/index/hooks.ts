import { useRouter } from 'next/dist/client/router';
import { useDispatch, useSelector } from 'react-redux';
import { increaseCount, decreaseCount } from '@store/actions/counter';
import { counterSelector } from '@store/model/counter/selectors';

export function useIndexPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  return {
    locale: router.locale as AvailableLocale,
    locales: router.locales as AvailableLocale[],
    count: useSelector(counterSelector),
    increase: () => dispatch(increaseCount()),
    decrease: () => dispatch(decreaseCount()),
    changeLang: (newLocale: AvailableLocale) =>
      router.push('/', '/', { locale: newLocale }),
  };
}
