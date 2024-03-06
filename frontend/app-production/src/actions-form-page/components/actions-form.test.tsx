import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { CreateUpdateBaseForm } from '@plentyag/brand-ui/src/components/create-update-base-form';
import {
  closeSnackbar,
  errorSnackbar,
  mockGlobalSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { render } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import React from 'react';

import { dataTestIds as actionFormTestIds, ActionsForm } from './actions-form';

// mock for: useGetActionModel
jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('@plentyag/brand-ui/src/components/create-update-base-form');
const mockCreateUpdateBaseForm = CreateUpdateBaseForm as jest.Mock;
mockCreateUpdateBaseForm.mockImplementation(({ onSuccess }) => {
  return (
    <button data-testid="mock-submit" onClick={onSuccess}>
      mock base form
    </button>
  );
});

mockGlobalSnackbar();

const testActionPath =
  'sites/SSF2/areas/PrimaryPostHarvest/lines/ToteProcessing/machines/ToteFiller/interfaces/ToteFiller/methods/ToteFilled';
const mockActionModel: ProdActions.ActionModel = {
  name: 'Tote Filled',
  description: 'Tote Filled',
  actionType: 'tell',
  fields: [
    {
      displayName: 'Tote Serial',
      name: 'tote_serial',
      type: 'TYPE_STRING',
    },
    {
      displayName: 'Crop',
      name: 'crop',
      type: 'TYPE_STRING',
    },
    {
      displayName: 'Weight In Grams',
      name: 'weight_in_grams',
      type: 'TYPE_FLOAT',
    },
  ],
};

const mockOperation: ProdActions.Operation = {
  path: testActionPath,
  prefilledArgs: {},
};

describe('ActionsForm', () => {
  beforeEach(() => {
    errorSnackbar.mockClear();
    closeSnackbar.mockClear();
    mockCreateUpdateBaseForm.mockClear();
  });

  function renderActionsForm(options: {
    mockActionModel?: ProdActions.ActionModel;
    hasPermissions?: boolean;
    mockError?: string;
  }) {
    mockCurrentUser({ permissions: { HYP_PRODUCTION: options.hasPermissions ? 'EDIT' : 'READ_AND_LIST' } });

    mockUseSwrAxios.mockReturnValue({
      ng: false,
      data: options.mockActionModel || mockActionModel,
    });

    return render(
      <ActionsForm operation={mockOperation} disableSubmitAfterSuccess={true} error={options.mockError || ''} />,
      {
        wrapper: AppProductionTestWrapper,
      }
    );
  }

  it('disables submit button when user does not have EDIT permssions', () => {
    renderActionsForm({ hasPermissions: false });
    expect(mockCreateUpdateBaseForm).toHaveBeenCalledWith(
      expect.objectContaining({ isSubmitDisabled: true }),
      expect.anything()
    );
  });

  it('enables submit button when user has EDIT permssions', () => {
    renderActionsForm({ hasPermissions: true });
    expect(mockCreateUpdateBaseForm).toHaveBeenCalledWith(
      expect.objectContaining({ isSubmitDisabled: false }),
      expect.anything()
    );
  });

  it('disables submit button if submission succeeded', () => {
    const { queryByTestId } = renderActionsForm({ hasPermissions: true });

    queryByTestId('mock-submit').click();

    expect(mockCreateUpdateBaseForm).toHaveBeenLastCalledWith(
      expect.objectContaining({ isSubmitDisabled: true }),
      expect.anything()
    );
  });

  it('shows snackbar error when error string is passed in props', () => {
    const mockError = 'ouch!';
    renderActionsForm({ mockError });
    expect(errorSnackbar).toHaveBeenCalledWith({ message: mockError });
  });

  it('shows no args message when action has no args', () => {
    const modelWithoutArgs = cloneDeep(mockActionModel);
    modelWithoutArgs.fields = [];
    const { queryByTestId } = renderActionsForm({ mockActionModel: modelWithoutArgs });
    expect(queryByTestId(actionFormTestIds.noArgsMsg)).toBeInTheDocument();
  });

  it('closes snackbar after mounting component', () => {
    renderActionsForm({ hasPermissions: true });
    expect(closeSnackbar).toHaveBeenCalled();
  });
});
