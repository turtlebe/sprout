import { buildSchedule, buildWidget, buildWidgetItem } from '@plentyag/app-environment/src/common/test-helpers';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { changeTextField, getInputByName, getSubmitButton } from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useDeleteRequest, usePostRequest, usePutRequest } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { DashboardGridContext } from '../../hooks';

import { dataTestIdsDropdownWidget as dataTestIds, DropdownWidget } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');

const widget = buildWidget({ items: [buildWidgetItem(buildSchedule({}))] });
const mockUseDeleteRequest = useDeleteRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUsePostRequest = usePostRequest as jest.Mock;
const onWidgetDeleted = jest.fn();
const onEditWidget = jest.fn();
const makeDeleteRequest = jest.fn();
const makePutRequest = jest.fn();
const makePostRequest = jest.fn();
const values = {
  name: 'newName',
  username: 'olittle',
};

function renderDropdownWidget() {
  return render(
    <MemoryRouter>
      <DashboardGridContext.Provider
        value={{ canDrag: false, dashboard: null, startDateTime: null, endDateTime: null }}
      >
        <DropdownWidget widget={widget} onWidgetDeleted={onWidgetDeleted} onEditWidget={onEditWidget} />
      </DashboardGridContext.Provider>
    </MemoryRouter>
  );
}

describe('DropdownWidget', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockCurrentUser();

    makeDeleteRequest.mockImplementation(({ onSuccess }) => onSuccess());
    mockUseDeleteRequest.mockReturnValue({ makeRequest: makeDeleteRequest, isLoading: false });
    mockUsePutRequest.mockReturnValue({ makeRequest: makePutRequest, isLoading: false });
    mockUsePostRequest.mockReturnValue({ makeRequest: makePostRequest, isLoading: false });
  });

  it('deletes a widget', () => {
    const { queryByTestId } = renderDropdownWidget();

    expect(queryByTestId(dataTestIds.deleteWidgetDialogConfirmation.root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.dropdown).click();
    queryByTestId(dataTestIds.deleteWidget).click();

    expect(queryByTestId(dataTestIds.deleteWidgetDialogConfirmation.root)).toBeInTheDocument();
    expect(onWidgetDeleted).not.toHaveBeenCalled();
    expect(makeDeleteRequest).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.deleteWidgetDialogConfirmation.confirm).click();

    expect(onWidgetDeleted).toHaveBeenCalled();
    expect(makeDeleteRequest).toHaveBeenCalled();
  });

  it('calls `onEditWidget`', () => {
    const { queryByTestId } = renderDropdownWidget();

    expect(queryByTestId(dataTestIds.deleteWidgetDialogConfirmation.root)).not.toBeInTheDocument();

    expect(onEditWidget).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.dropdown).click();
    queryByTestId(dataTestIds.editWidget).click();

    expect(onEditWidget).toHaveBeenCalled();
  });

  it("updates the widget's name", async () => {
    const { queryByTestId } = renderDropdownWidget();

    queryByTestId(dataTestIds.dropdown).click();
    queryByTestId(dataTestIds.editWidgetName).click();

    expect(getInputByName('widgetType')).not.toBeInTheDocument();

    await actAndAwait(() => changeTextField('name', values.name));

    expect(makePutRequest).not.toHaveBeenCalled();

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makePutRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { ...widget, name: values.name, updatedBy: values.username },
        url: EVS_URLS.widgets.updateUrl(widget),
      })
    );
  });

  it('calls `onEditWidget`', () => {
    const { queryByTestId } = renderDropdownWidget();

    expect(queryByTestId(dataTestIds.deleteWidgetDialogConfirmation.root)).not.toBeInTheDocument();

    expect(onEditWidget).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.dropdown).click();
    queryByTestId(dataTestIds.editWidget).click();

    expect(onEditWidget).toHaveBeenCalled();
  });
});
