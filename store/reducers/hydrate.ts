import { State } from '@store/model';
import { HydrateAction } from '@store/actions/hydrate';

// reconciliation here should be done properly based on the real app State
// this is just overwriting client state!
// see https://github.com/kirill-konshin/next-redux-wrapper#state-reconciliation-during-hydration
export const hydrateReducer = (
  state: State | undefined,
  action: HydrateAction
): State => {
  return {
    ...state,
    ...action.payload,
  } as State;
};
