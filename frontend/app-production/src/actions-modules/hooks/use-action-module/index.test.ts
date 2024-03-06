import {
  errorSnackbar,
  mockGlobalSnackbar,
  successSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES, mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { actAndAwaitForHook, mockConsoleError } from '@plentyag/core/src/test-helpers';
import { act, renderHook } from '@testing-library/react-hooks';

import { SetTransferConveyanceDefaultBehaviorExecutionMode } from '../../modules';
import { SetTransferConveyanceDefaultBehaviorExecutionModeSerializers } from '../../serializers';
import { mockExecutionModeActionModel, mockTransferConveyanceReactorState } from '../../test-helpers';

import { useActionModule } from '.';

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;

describe('useActionModule', () => {
  let mockMakeDataModelRequest;

  mockCurrentUser();
  const mockCoreState = {
    currentUser: DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES,
  } as any;

  function renderUseActionModule(props = {}) {
    return renderHook(
      ({ reactorState }) =>
        useActionModule({
          actionModule: SetTransferConveyanceDefaultBehaviorExecutionMode,
          path: 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance',
          getDataModel: actionModel =>
            SetTransferConveyanceDefaultBehaviorExecutionModeSerializers.getDataModelFromReactorState(
              actionModel,
              reactorState,
              mockCoreState
            ),
          isLoading: false,
          ...props,
        }),
      {
        initialProps: { reactorState: mockTransferConveyanceReactorState },
      }
    );
  }

  beforeEach(() => {
    // ARRANGE
    // -- mock return Action Model
    mockUseSwrAxios.mockReturnValue({
      data: mockExecutionModeActionModel,
      isValidating: false,
      error: null,
    });

    // -- mock setup Data Model post request
    mockMakeDataModelRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess(true));
    mockUsePostRequest.mockReturnValue({
      makeRequest: mockMakeDataModelRequest,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    it('returns loading if passthrough is loading', () => {
      // ACT
      const { result } = renderUseActionModule({ isLoading: true });

      // ASSERT
      expect(result.current.actionModuleProps.isLoading).toBeTruthy();
    });

    it('returns loading if action model is still loading', () => {
      // ARRANGE
      // -- mock return Action Model
      mockUseSwrAxios.mockReturnValue({
        data: null,
        isValidating: true,
        error: null,
      });

      // ACT
      const { result } = renderUseActionModule();

      // ASSERT
      expect(result.current.actionModuleProps.isLoading).toBeTruthy();
    });
  });

  describe('reset form with new data', () => {
    it('resetForm => should reset the form with new data (revert)', () => {
      // ARRANGE
      const { rerender, result } = renderUseActionModule({
        actionModule: {
          ...SetTransferConveyanceDefaultBehaviorExecutionMode,
        },
      });

      const mockNewReactorState = {
        state: {
          ...mockTransferConveyanceReactorState.state,
          transferConveyanceBehaviorExecutionMode: 'DO_NOT_EXECUTE_DEFAULT_BEHAVIORS',
        },
      };

      // ACT
      rerender({
        reactorState: mockNewReactorState,
      });
      act(() => {
        result.current.resetForm();
      });

      // ASSERT
      expect(result.current.actionModuleProps.formik.values).toEqual({
        submitter: 'olittle',
        submission_method: 'FarmOS UI',
        default_behavior_execution_mode: { value: 'DO_NOT_EXECUTE_DEFAULT_BEHAVIORS' },
      });
    });
  });

  describe('successful flow', () => {
    it('returns appropriate action module props and with changes, successfully submit', async () => {
      // ACT 1 - initial
      const { result } = renderUseActionModule();

      // ASSERT 1
      expect(mockUseSwrAxios).toHaveBeenCalledWith({
        url: '/api/production/actions/sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/interfaces/Requests/methods/SetTransferConveyanceDefaultBehaviorExecutionMode',
      });
      expect(mockUsePostRequest).toHaveBeenCalledWith({
        url: '/api/plentyservice/executive-service/request/sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/interfaces/Requests/methods/SetTransferConveyanceDefaultBehaviorExecutionMode',
      });
      expect(result.current.actionModuleProps.actionModel).toEqual(mockExecutionModeActionModel);
      expect(result.current.actionModuleProps.isLoading).toBeFalsy();
      expect(result.current.actionModuleProps.formik.values).toEqual({
        default_behavior_execution_mode: { value: 'EXECUTE_DEFAULT_BEHAVIORS' },
        submitter: DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES.username,
        submission_method: 'FarmOS UI',
      });

      // ACT 2 - make change
      await actAndAwaitForHook(() =>
        result.current.actionModuleProps.formik.setFieldValue('default_behavior_execution_mode', {
          value: 'DO_NOT_EXECUTE_DEFAULT_BEHAVIORS',
        })
      );

      // ASSERT 2
      expect(result.current.actionModuleProps.formik.dirty).toBeTruthy();

      // ACT 3 - submit
      await actAndAwaitForHook(async () => result.current.handleSubmit());

      // ASSERT 3
      expect(successSnackbar).toHaveBeenCalledWith(
        'Edited SetTransferConveyanceDefaultBehaviorExecutionMode with Success'
      );
    });

    it('should not submit if nothing has changed (dirty)', async () => {
      // ACT 1 - initial
      const { result } = renderUseActionModule();

      // ASSERT 1
      expect(result.current.actionModuleProps.formik.dirty).toBeFalsy();

      // ACT 2 - submit
      await actAndAwaitForHook(async () => result.current.handleSubmit());

      // ASSERT 2
      expect(successSnackbar).not.toHaveBeenCalled();
    });
  });

  describe('error flow', () => {
    beforeEach(() => {
      mockConsoleError();
    });

    it('handles error if there are problems with getting action model', () => {
      // ARRANGE
      // -- mock error on action model
      const mockError = new Error('nope');
      mockUseSwrAxios.mockReturnValue({
        data: null,
        isValidating: false,
        error: mockError,
      });

      // ACT
      renderUseActionModule();

      // ASSERT
      expect(errorSnackbar).toHaveBeenCalledWith({
        title: 'Error getting SetTransferConveyanceDefaultBehaviorExecutionMode action definition',
        message: 'nope',
      });
    });

    it('handles error if it fails after submitting', async () => {
      // ARRANGE
      // -- preemptive error
      const mockError = new Error('nope');
      mockMakeDataModelRequest = jest.fn().mockImplementation(({ onError }) => onError(mockError));
      mockUsePostRequest.mockReturnValue({
        makeRequest: mockMakeDataModelRequest,
      });

      // -- render and ready to submit
      const { result } = renderUseActionModule();

      await actAndAwaitForHook(() =>
        result.current.actionModuleProps.formik.setFieldValue('default_behavior_execution_mode', {
          value: 'DO_NOT_EXECUTE_DEFAULT_BEHAVIORS',
        })
      );

      // ACT
      try {
        await actAndAwaitForHook(async () => result.current.handleSubmit());
      } catch (e) {
        expect(e).toEqual(mockError);
      }

      // ASSERT
      expect(errorSnackbar).toHaveBeenCalledWith({
        title: 'Error saving SetTransferConveyanceDefaultBehaviorExecutionMode',
        message: 'nope',
      });
      expect.assertions(2);
    });
  });
});
