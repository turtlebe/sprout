import { CoreState } from '@plentyag/core/src/core-store/types';
import { isIgnition } from '@plentyag/core/src/utils/is-ignition';

import { getExecutiveServiceSubmitterHeaders, SUBMISSION_METHOD_DEFAULT, SUBMISSION_METHOD_IGNITION_CONTEXT } from '.';

jest.mock('@plentyag/core/src/utils/is-ignition');

const mockIsIgntion = isIgnition as jest.Mock;
const defaultState: CoreState = { currentUser: { username: 'olittle' } } as unknown as CoreState;
const emptyState: CoreState = {} as unknown as CoreState;

describe('getExecutiveRequestCommandHeaders', () => {
  beforeEach(() => {
    mockIsIgntion.mockRestore();
    mockIsIgntion.mockReturnValue(false);
  });

  it('returns the required headers for executive-service commands', () => {
    const headers = getExecutiveServiceSubmitterHeaders(defaultState);

    expect(headers).toHaveProperty('submitter', 'olittle');
    expect(headers).toHaveProperty('submission_method', SUBMISSION_METHOD_DEFAULT);
  });

  it('returns the required headers for executive-service commands (with empty global state)', () => {
    const headers = getExecutiveServiceSubmitterHeaders(emptyState);

    expect(headers).toHaveProperty('submitter', '');
    expect(headers).toHaveProperty('submission_method', SUBMISSION_METHOD_DEFAULT);
  });

  describe('when isIgnition() returns true', () => {
    beforeEach(() => {
      mockIsIgntion.mockReturnValue(true);
    });

    it('returns the required headers for executive-service commands', () => {
      const headers = getExecutiveServiceSubmitterHeaders(defaultState);

      expect(headers).toHaveProperty('submitter', 'olittle');
      expect(headers).toHaveProperty('submission_method', SUBMISSION_METHOD_IGNITION_CONTEXT);
    });

    it('returns the required headers for executive-service commands (with empty global state)', () => {
      const headers = getExecutiveServiceSubmitterHeaders(emptyState);

      expect(headers).toHaveProperty('submitter', '');
      expect(headers).toHaveProperty('submission_method', SUBMISSION_METHOD_IGNITION_CONTEXT);
    });
  });
});
