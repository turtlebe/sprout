import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjcetUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import {
  changeTextField,
  chooseFromSelect,
  getInputByName,
  getSubmitButton,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { WidgetType } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ButtonCreateWidget, dataTestIdsButtonCreateWidget as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

const values = {
  dashboardId: 'dashboardId',
  name: 'Test Name',
  widgetType: WidgetType.liveGroup,
  rowStart: 1,
  colStart: 1,
  rowEnd: 2,
  colEnd: 2,
};

describe('ButtonCreateWidget', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser();
    const { container } = render(<ButtonCreateWidget dashboardId={values.dashboardId} onSuccess={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens a dialog to create a widget', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({ id: 'id' }));
    const onSuccess = jest.fn();
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjcetUseSwrAxiosImpl(args);
    });

    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'EDIT' } });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonCreateWidget dashboardId={values.dashboardId} onSuccess={onSuccess} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    expect(getInputByName('widgetType')).toHaveValue('');
    expect(getInputByName('name')).toHaveValue('');
    expect(queryByTestId(getSubmitButton())).toBeInTheDocument();

    // -> Choose a WidgetType
    await actAndAwait(() => openSelect('widgetType'));
    await actAndAwait(() => chooseFromSelect(values.widgetType));

    // -> Choose a Name
    await actAndAwait(() => changeTextField('name', values.name));

    expect(getInputByName('widgetType')).toHaveValue(values.widgetType);
    expect(getInputByName('name')).toHaveValue(values.name);

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith({
      data: {
        ...values,
        createdBy: 'olittle',
      },
      url: EVS_URLS.widgets.createUrl(),
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});
