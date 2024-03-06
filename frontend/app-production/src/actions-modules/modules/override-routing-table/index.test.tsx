import { getInitialDataModelFromActionModel } from '@plentyag/app-production/src/actions-modules/shared/utils';
import { mockOverrideRoutingTableActionModel } from '@plentyag/app-production/src/actions-modules/test-helpers';
import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsOverrideRoutingTable as dataTestIds, OverrideRoutingTable } from '.';

import { dataTestIdsRuleRow } from './components/rule-row';

describe('OverrideRoutingTable', () => {
  function renderComponent(props?: Partial<ActionModuleProps>) {
    const mockFormik = {
      values: getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel),
      isValid: true,
      setValues: jest.fn(),
    } as any;

    return render(
      <OverrideRoutingTable
        formik={mockFormik}
        actionModel={mockOverrideRoutingTableActionModel}
        isLoading={false}
        {...props}
      />
    );
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading if isLoading is passed through', () => {
    // ACT
    const { queryByTestId } = renderComponent({
      isLoading: true,
    });

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).toBeInTheDocument();
  });

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderComponent();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsRuleRow.ruleClosedMode(1))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();
  });

  it('renders rows that are partially filled out', () => {
    // ARRANGE
    const mockFormik = {
      values: {
        ...getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel),
        rule_1_from: { value: 'GR1-1A' },
      },
      isValid: false,
      setValues: jest.fn(),
    } as any;

    // ACT
    const { queryByTestId } = renderComponent({
      formik: mockFormik,
    });

    // ASSERT
    expect(queryByTestId(dataTestIdsRuleRow.ruleEditMode(1))).toBeInTheDocument();
  });

  it('should not render next row if form is not valid', () => {
    // ARRANGE
    const mockFormik = {
      values: getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel),
      isValid: false,
      setValues: jest.fn(),
    } as any;

    // ACT
    const { queryByTestId } = renderComponent({
      formik: mockFormik,
    });

    // ASSERT
    expect(queryByTestId(dataTestIdsRuleRow.ruleClosedMode(1))).not.toBeInTheDocument();
  });

  it('should handle delete when clicked on a row', async () => {
    // ARRANGE
    const mockEmptyDataModel = getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel);

    const mockSetValues = jest.fn();

    const currentDataModel = {
      ...mockEmptyDataModel,
      rule_1_from: { value: 'GR1-1A' },
      rule_1_condition: { value: 'WAIT_FOR_CARRIER_EMPTY_BEFORE_MOVING' },
      rule_1_to: { value: 'GR1-1B' },
    };

    const mockFormik = {
      values: currentDataModel,
      isValid: true,
      setValues: mockSetValues,
    } as any;

    const { queryByTestId } = renderComponent({
      formik: mockFormik,
    });

    // ACT
    await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIdsRuleRow.deleteRuleButton(1))));

    // ASSERT
    expect(mockSetValues).toHaveBeenCalledWith(mockEmptyDataModel);
  });
});
