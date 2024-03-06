import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { PlentyLink } from '@plentyag/brand-ui/src/components';
import {
  errorSnackbar,
  mockGlobalSnackbar,
  successSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { notifyProductionActionHasCompleted } from '../../utils';

import { DOWNLOAD_PDF_MESSAGE, FAIL_MESSAGE, SUCCESS_MESSAGE, useHandleActionSubmit } from '.';

mockGlobalSnackbar();

jest.mock('../../utils');
const mockNotifyProductionActionHasCompleted = notifyProductionActionHasCompleted as jest.Mock;
const mockReturnObjectURL = 'objectURL';
URL.createObjectURL = jest.fn(() => mockReturnObjectURL);

const basePath = '/production/sites/LAX1/farms/LAX1';
const reactorsAndTasksDetailBasePath = `${basePath}/reactors-and-tasks/detail`;

describe('useHandleActionSubmit', () => {
  beforeEach(() => {
    errorSnackbar.mockClear();
    successSnackbar.mockClear();
  });

  function renderUseHandleActionSubmit() {
    return renderHook(() => useHandleActionSubmit(), {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('sets "hasSubmitted" to true when handleSuccess is called', () => {
    const { result } = renderUseHandleActionSubmit();

    expect(result.current.hasSubmitted).toBe(false);
    act(() => result.current.handleSuccess({}));
    expect(result.current.hasSubmitted).toBe(true);
  });

  it('show snackbar success when handleSuccess is called', () => {
    const { result } = renderUseHandleActionSubmit();

    expect(successSnackbar).not.toHaveBeenCalled();
    expect(errorSnackbar).not.toHaveBeenCalled();

    act(() => result.current.handleSuccess({}));

    expect(successSnackbar).toHaveBeenCalledWith(SUCCESS_MESSAGE);
    expect(errorSnackbar).not.toHaveBeenCalled();

    expect(mockNotifyProductionActionHasCompleted).toHaveBeenCalledWith(200, '');
  });

  it('show snackbar success with message when handleSuccess is called', () => {
    const { result } = renderUseHandleActionSubmit();

    expect(successSnackbar).not.toHaveBeenCalled();
    expect(errorSnackbar).not.toHaveBeenCalled();

    act(() => result.current.handleSuccess({ success: true, message: 'Test message' }));

    expect(successSnackbar).toHaveBeenCalledWith(SUCCESS_MESSAGE + ': Test message');
    expect(errorSnackbar).not.toHaveBeenCalled();

    expect(mockNotifyProductionActionHasCompleted).toHaveBeenCalledWith(200, '');
  });

  it('shows snackbar error when handleError is called', () => {
    const { result } = renderUseHandleActionSubmit();

    expect(successSnackbar).not.toHaveBeenCalled();
    expect(errorSnackbar).not.toHaveBeenCalled();

    const err = 'ouch';
    act(() => result.current.handleError(err));

    expect(successSnackbar).not.toHaveBeenCalled();
    expect(errorSnackbar).toHaveBeenCalledWith({ message: expect.stringContaining(err) });
    expect(errorSnackbar).toHaveBeenCalledWith({ message: expect.stringContaining(FAIL_MESSAGE) });

    expect(mockNotifyProductionActionHasCompleted).toHaveBeenCalledWith(500, err);
  });

  it('adds link to reactor when response provides reactor path', () => {
    const mockReactorPath = 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance';
    const mockTaskId = '4ece6894-18ba-4e7d-8810-954a3c154abf';
    const { result } = renderUseHandleActionSubmit();

    act(() =>
      result.current.handleSuccess({
        taskExecutorPath: mockReactorPath,
        taskId: mockTaskId,
      })
    );

    const reactorPath = `${reactorsAndTasksDetailBasePath}/${mockReactorPath}?taskId=${mockTaskId}`;

    expect(successSnackbar).toHaveBeenCalledWith(expect.stringContaining(reactorPath));
  });

  it('adds link to reactor without query parameter when taskId is not provided', () => {
    const mockReactorPath = 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance';
    const { result } = renderUseHandleActionSubmit();

    act(() =>
      result.current.handleSuccess({
        taskExecutorPath: mockReactorPath,
        taskId: undefined,
      })
    );

    const reactorPath = `${reactorsAndTasksDetailBasePath}/${mockReactorPath}`;

    expect(successSnackbar).toHaveBeenCalledWith(expect.stringContaining(reactorPath));
  });

  it('adds link to PDF', () => {
    const { result } = renderUseHandleActionSubmit();
    const testFilename = 'filename.pdf';
    const expectJsxComponent = (
      <span>
        {DOWNLOAD_PDF_MESSAGE}
        <PlentyLink to={mockReturnObjectURL} isReactRouterLink={false} download={testFilename}>
          {testFilename}
        </PlentyLink>
      </span>
    );

    act(() =>
      result.current.handleSuccess({
        data: 'data',
        dataType: 'base64/pdf',
        dataTitle: 'filename.pdf',
      })
    );

    expect(successSnackbar).toHaveBeenCalledWith(expectJsxComponent, { disableAutoHide: true });
  });
});
