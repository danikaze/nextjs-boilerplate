import { ActionType } from 'redux-promise-middleware';
import { Action } from '@store/actions';

/**
 * Utility method related to redux-promise-middleware
 * Check if an action returning a promise in the payload is still pending
 *
 * Shouldn't be needed when TypeScript 4.1.0 comes out
 *
 * @param action The action to check
 * @param type The original type of action we want to check
 */
export function isPendingAction(action: Action, type: Action['type']): boolean {
  return action.type === `${type}_${ActionType.Pending}`;
}

/**
 * Utility method related to redux-promise-middleware
 * Check if an action returning a promise in the payload has been fulfilled
 *
 * Shouldn't be needed when TypeScript 4.1.0 comes out
 *
 * @param action The action to check
 * @param type The original type of action we want to check
 */
export function isFulfilledAction(
  action: Action,
  key: Action['type']
): boolean {
  return action.type === `${key}_${ActionType.Fulfilled}`;
}

/**
 * Utility method related to redux-promise-middleware
 * Check if an action returning a promise in the payload has been rejected
 *
 * Shouldn't be needed when TypeScript 4.1.0 comes out
 *
 * @param action The action to check
 * @param type The original type of action we want to check
 */
export function isRejectedAction(action: Action, key: Action['type']): boolean {
  return action.type === `${key}_${ActionType.Rejected}`;
}
