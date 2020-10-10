import { Reducer } from 'redux';
import { Action } from '@store/actions';
import { Metadata } from '@store/model/metadata';

const defaultState: Metadata = {
  lang: 'en',
};

export const metadataReducer: Reducer<Metadata, Action> = (
  state = defaultState,
  action
) => {
  if (action.type === 'SET_LANG') {
    return {
      lang: action.payload,
    };
  }

  return state;
};
