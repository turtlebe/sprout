import { mockExecutionModeActionModel, mockTransferConveyanceReactorState } from '../../test-helpers';

import { getDataModelFromReactorState } from '.';

describe('getDataSchemaFromActionModel', () => {
  it('returns correct data model', () => {
    // ACT
    const result = getDataModelFromReactorState(mockExecutionModeActionModel, mockTransferConveyanceReactorState, {
      currentUser: { username: 'olittle' },
    } as any);

    // ASSERT
    expect(result).toEqual({
      submitter: 'olittle',
      submission_method: 'FarmOS UI',
      default_behavior_execution_mode: { value: 'EXECUTE_DEFAULT_BEHAVIORS' },
    });
  });
});
