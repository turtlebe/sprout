import { DialogDashboardAlertRules } from '@plentyag/app-environment/src/common/components';
import { mockDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDropdownDashboardActions as dataTestIds, DropdownDashboardActions } from '.';

jest.mock('@plentyag/brand-ui/src/components/dialog-base-form');
jest.mock('@plentyag/app-environment/src/common/components/dialog-dashboard-alert-rules');

const MockDialogBaseForm = DialogBaseForm as jest.Mock;
const MockDialogDashboardAlertRules = DialogDashboardAlertRules as jest.Mock;

MockDialogBaseForm.mockImplementation(({ open }) =>
  open ? <div data-testid={dataTestIds.dialogEditDashboard} /> : null
);
MockDialogDashboardAlertRules.mockImplementation(({ open }) =>
  open ? <div data-testid={dataTestIds.dialogEditDashboardAlertRules} /> : null
);

const [dashboard] = mockDashboards;

describe('DropdownDashboardActions', () => {
  it('opens a modal to edit the Dashboard', () => {
    const { queryByTestId } = render(<DropdownDashboardActions dashboard={dashboard} onDashboardUpdated={jest.fn()} />);

    expect(queryByTestId(dataTestIds.editDashboard)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogEditDashboard)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.moveResizeWidgets)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.editDashboard)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogEditDashboard)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.editDashboard).click();

    queryByTestId(dataTestIds.dialogEditDashboard).click();
  });

  it('opens a modal to edit the DashboardAlertRules', () => {
    const { queryByTestId } = render(<DropdownDashboardActions dashboard={dashboard} onDashboardUpdated={jest.fn()} />);

    expect(queryByTestId(dataTestIds.editDashboardAlertRules)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogEditDashboardAlertRules)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.editDashboardAlertRules)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogEditDashboardAlertRules)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.editDashboardAlertRules).click();

    queryByTestId(dataTestIds.dialogEditDashboardAlertRules).click();
  });

  it('calls `onClickMoveResizeWidgets`', () => {
    const onClickMoveResizeWidgets = jest.fn();
    const { queryByTestId } = render(
      <DropdownDashboardActions
        dashboard={dashboard}
        onDashboardUpdated={jest.fn()}
        onClickMoveResizeWidgets={onClickMoveResizeWidgets}
      />
    );

    queryByTestId(dataTestIds.root).click();

    expect(onClickMoveResizeWidgets).not.toHaveBeenCalled();
    expect(queryByTestId(dataTestIds.moveResizeWidgets)).toBeInTheDocument();

    queryByTestId(dataTestIds.moveResizeWidgets).click();

    expect(onClickMoveResizeWidgets).toHaveBeenCalled();
  });
});
