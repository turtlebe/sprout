import _merge from 'lodash/merge';

/**
 * Helper for immutable state merging with lodash _merge
 *
 * @param state The original state
 * @param nextState The next state
 */
export const mergeStates = <T>(state: T, nextState: any): T => _merge<{}, T, any>({}, state, nextState);
