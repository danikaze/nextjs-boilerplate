import { Action } from '@store/actions';
import { ActionType } from 'redux-promise-middleware';
import 'jest';
import {
  isPendingAction,
  isFulfilledAction,
  isRejectedAction,
} from '../redux-promise-actions';

const type = ('ACTION' as unknown) as Action['type'];
const action = ({
  type,
} as unknown) as Action;
const pendingAction = ({
  type: `${type}_${ActionType.Pending}`,
} as unknown) as Action;
const fulfilledAction = ({
  type: `${type}_${ActionType.Fulfilled}`,
} as unknown) as Action;
const rejectedAction = ({
  type: `${type}_${ActionType.Rejected}`,
} as unknown) as Action;

describe('redux-promise-actions', () => {
  it('isPendingAction should work ok', async () => {
    expect(isPendingAction(action, type)).toBe(false);
    expect(isPendingAction(pendingAction, type)).toBe(true);
    expect(isPendingAction(fulfilledAction, type)).toBe(false);
    expect(isPendingAction(rejectedAction, type)).toBe(false);
  });

  it('isFulfilledAction should work ok', async () => {
    expect(isFulfilledAction(action, type)).toBe(false);
    expect(isFulfilledAction(pendingAction, type)).toBe(false);
    expect(isFulfilledAction(fulfilledAction, type)).toBe(true);
    expect(isFulfilledAction(rejectedAction, type)).toBe(false);
  });

  it('isRejectedAction should work ok', async () => {
    expect(isRejectedAction(action, type)).toBe(false);
    expect(isRejectedAction(pendingAction, type)).toBe(false);
    expect(isRejectedAction(fulfilledAction, type)).toBe(false);
    expect(isRejectedAction(rejectedAction, type)).toBe(true);
  });
});
