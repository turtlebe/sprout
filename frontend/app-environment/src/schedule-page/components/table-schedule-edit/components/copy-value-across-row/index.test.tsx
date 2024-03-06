import { mockScheduleDefinitions } from '@plentyag/app-environment/src/common/test-helpers';
import { changeTextField, getInputByName } from '@plentyag/brand-ui/src/test-helpers';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsActionValueInput as dataTestValueInputIds } from '..';

import { CopyValueAcrossRow, dataTestIdsCopyValueAcrossRow as dataTestIds } from '.';

const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.name === 'SetLightIntensity');
const onCancel = jest.fn();
const onCopyActionValueAcrossRow = jest.fn();

function renderCopyValueAcrossRow() {
  return render(
    <CopyValueAcrossRow
      scheduleDefinition={scheduleDefinition}
      onCancel={onCancel}
      onCopyActionValueAcrossRow={onCopyActionValueAcrossRow}
    />
  );
}

describe('CopyValueAcrossRow', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockUseFetchMeasurementTypes();
  });

  it('calls row action cancel copy button', () => {
    const { queryByTestId } = renderCopyValueAcrossRow();

    expect(queryByTestId(dataTestIds.buttonCancelCopyValueAcrossRow)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.buttonApplyCopyValueAcrossRow)).toBeInTheDocument();

    queryByTestId(dataTestIds.buttonCancelCopyValueAcrossRow).click();
    expect(onCancel).toHaveBeenCalled();
    expect(onCopyActionValueAcrossRow).not.toHaveBeenCalled();
  });

  it('calls row actions apply copy button with default values', () => {
    const { queryByTestId } = renderCopyValueAcrossRow();

    expect(queryByTestId(dataTestIds.buttonCancelCopyValueAcrossRow)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.buttonApplyCopyValueAcrossRow)).toBeInTheDocument();

    queryByTestId(dataTestIds.buttonApplyCopyValueAcrossRow).click();
    expect(onCancel).not.toHaveBeenCalled();
    expect(onCopyActionValueAcrossRow).toHaveBeenCalledWith('20');
  });

  it('calls row actions apply copy button with updated values', async () => {
    const { queryByTestId } = renderCopyValueAcrossRow();

    expect(queryByTestId(dataTestIds.buttonCancelCopyValueAcrossRow)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.buttonApplyCopyValueAcrossRow)).toBeInTheDocument();

    expect(
      getInputByName(dataTestValueInputIds.selectDropdownValueInput(dataTestIds.cellCopyValueAcrossRow))
    ).toHaveValue('20');

    // Update value
    await actAndAwait(() =>
      changeTextField(dataTestValueInputIds.selectDropdownValueInput(dataTestIds.cellCopyValueAcrossRow), '80')
    );

    queryByTestId(dataTestIds.buttonApplyCopyValueAcrossRow).click();
    expect(onCancel).not.toHaveBeenCalled();
    expect(onCopyActionValueAcrossRow).toHaveBeenCalledWith('80');
  });
});
