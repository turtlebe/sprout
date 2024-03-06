import {
  useGenerateFormGenConfigFromActionModel,
  useGetActionModel,
} from '@plentyag/app-production/src/actions-form-page/hooks';
import { BaseForm } from '@plentyag/brand-ui/src/components';
import { mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { usePostRequest, usePutRequest } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';

import { CreateTask, UpdateTask } from '../../../common/types';

import { DrawerCreateUpdateTask } from '.';

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/hooks');
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;

jest.mock('@plentyag/app-production/src/actions-form-page/hooks/use-get-action-model');
const mockUseGetActionModel = useGetActionModel as jest.Mock;
mockUseGetActionModel.mockReturnValue({});

jest.mock('@plentyag/app-production/src/actions-form-page/hooks/use-generate-form-gen-config-from-action-model');
const mockUseGenerateFormGenConfigFromActionModel = useGenerateFormGenConfigFromActionModel as jest.Mock;
const mockFormGenConfig = {
  serialize: values => values,
  deserialize: values => values,
};
mockUseGenerateFormGenConfigFromActionModel.mockReturnValue(mockFormGenConfig);

jest.mock('@plentyag/brand-ui/src/components/base-form');
const mockBaseForm = BaseForm as jest.Mock;
const mockTaskParameters = {
  num_tray: 1,
  product: 'WHC',
};
mockBaseForm.mockImplementation(props => {
  return (
    <button
      data-testid="mock-fake-submit"
      onClick={() =>
        props.onSubmit({
          ...mockTaskParameters,
          submitter: 'jsmith',
          submission_method: 'farmos',
          emptyValueThatShouldBeRemovedAndNotSubmitted: { x: undefined, emptyArray: [] },
        })
      }
    >
      submit
    </button>
  );
});

describe('DrawerCreateUpdateTask', () => {
  afterEach(() => {
    mockBaseForm.mockClear();
  });

  it('submits correct data to create a task', () => {
    const mockMakeRequest = jest.fn().mockImplementation(({ onSuccess }) => {
      onSuccess();
    });
    mockUsePostRequest.mockReturnValue({
      isLoading: false,
      makeRequest: mockMakeRequest,
    });

    const mockUpdateRequest = jest.fn();
    mockUsePutRequest.mockReturnValue({
      isLoading: false,
      makeRequest: mockUpdateRequest,
    });

    const date = new Date();
    // 2022-01-02
    date.setFullYear(2022);
    date.setMonth(0);
    date.setDate(2);

    const workcenterPath = 'sites/LAX1/farms/LAX1/workCenters/Seed';
    const taskPath = 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed';
    const selectedTask: CreateTask = {
      isUpdating: false,
      taskPath,
    };
    const mockOnClose = jest.fn();
    const mockOnSuccess = jest.fn();
    const { queryByTestId } = render(
      <DrawerCreateUpdateTask
        task={selectedTask}
        plannedDate={date}
        workcenterPath={workcenterPath}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    queryByTestId('mock-fake-submit').click();

    expect(mockMakeRequest).toHaveBeenLastCalledWith({
      data: {
        plan: undefined,
        workcenter: workcenterPath,
        plannedDate: '2022-01-02',
        taskPath,
        taskParametersJsonPayload: JSON.stringify(mockTaskParameters),
      },
      onSuccess: expect.anything(),
      onError: expect.anything(),
    });

    expect(mockUpdateRequest).not.toHaveBeenCalled();

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalled();

    expect(mockBaseForm).toHaveBeenLastCalledWith(
      expect.objectContaining({
        initialValues: {},
      }),
      expect.anything()
    );
  });

  it('submits correct data to update a task', () => {
    const mockMakeRequest = jest.fn();
    mockUsePostRequest.mockReturnValue({
      isLoading: false,
      makeRequest: mockMakeRequest,
    });

    const mockUpdateRequest = jest.fn().mockImplementation(({ onSuccess }) => {
      onSuccess();
    });
    mockUsePutRequest.mockReturnValue({
      isLoading: false,
      makeRequest: mockUpdateRequest,
    });

    const date = new Date();
    // 2022-01-02
    date.setFullYear(2022);
    date.setMonth(0);
    date.setDate(2);

    const workcenterPath = 'sites/LAX1/farms/LAX1/workCenters/Seed';
    const taskPath = 'sites/LAX1/farms/LAX1/workCenters/Seed/interfaces/Seed';
    const initValues = {
      num_tray: 2,
      product: 'WHC',
    };
    const selectedTask: UpdateTask = {
      isUpdating: true,
      taskPath,
      taskId: 'fake-id',
      taskParametersJsonPayload: JSON.stringify(initValues),
    };
    const mockOnClose = jest.fn();
    const mockOnSuccess = jest.fn();
    const { queryByTestId } = render(
      <DrawerCreateUpdateTask
        task={selectedTask}
        plannedDate={date}
        workcenterPath={workcenterPath}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    queryByTestId('mock-fake-submit').click();

    expect(mockUpdateRequest).toHaveBeenLastCalledWith({
      data: {
        taskParametersJsonPayload: JSON.stringify(mockTaskParameters),
      },
      onSuccess: expect.anything(),
      onError: expect.anything(),
    });

    expect(mockMakeRequest).not.toHaveBeenCalled();

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalled();

    expect(mockBaseForm).toHaveBeenLastCalledWith(
      expect.objectContaining({
        initialValues: initValues,
      }),
      expect.anything()
    );
  });
});
