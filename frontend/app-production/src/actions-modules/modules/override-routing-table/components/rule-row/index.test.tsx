import { dataTestIdsDropDown } from '@plentyag/app-production/src/actions-modules/shared/components/drop-down';
import { getInitialDataModelFromActionModel } from '@plentyag/app-production/src/actions-modules/shared/utils';
import { mockOverrideRoutingTableActionModel } from '@plentyag/app-production/src/actions-modules/test-helpers';
import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsRuleRow as dataTestIds, RuleRow } from '.';

describe('RuleRow', () => {
  const ruleNumber = 1;

  function renderRuleRow(props?: Partial<ActionModuleProps & RuleRow>) {
    const mockFormik = {
      values: getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel),
      setFieldValue: jest.fn(),
    } as any;

    return render(
      <RuleRow
        formik={mockFormik}
        actionModel={mockOverrideRoutingTableActionModel}
        ruleNumber={ruleNumber}
        onDelete={jest.fn()}
        {...props}
      />
    );
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('start state', () => {
    it('renders row with Add Rule button', () => {
      // ACT
      const { queryByTestId } = renderRuleRow();

      // ASSERT
      expect(queryByTestId(dataTestIds.ruleClosedMode(1))).toBeInTheDocument();
    });

    it('renders row in edit mode once there is some values', () => {
      // ARRANGE
      const mockFormik = {
        values: {
          ...getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel),
          rule_1_from: { value: 'GR1-1B' },
          rule_1_condition: { value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING' },
        },
        setFieldValue: jest.fn(),
      } as any;

      // ACT
      const { queryByTestId } = renderRuleRow({
        formik: mockFormik,
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.ruleEditMode(1))).toBeInTheDocument();
    });

    it('renders errors', () => {
      // ARRANGE
      const mockFormik = {
        values: {
          ...getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel),
          rule_1_from: { value: 'GR1-1B' },
          rule_1_condition: { value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING' },
        },
        submitCount: 1,
        errors: {
          rule_1_to: 'This is an error',
        },
        setFieldValue: jest.fn(),
      } as any;

      // ACT
      const { queryByTestId } = renderRuleRow({
        formik: mockFormik,
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.ruleEditMode(1))).toBeInTheDocument();
    });

    it('formats the "condition" choices in a new human-readable sentence', () => {
      // ARRANGE
      const mockFormik = {
        values: {
          ...getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel),
          rule_1_from: { value: 'GR1-1B' },
          rule_1_condition: { value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING' },
        },
        setFieldValue: jest.fn(),
      } as any;

      // ACT
      const { queryByTestId } = renderRuleRow({
        formik: mockFormik,
      });

      // ASSERT
      expect(queryByTestId(dataTestIdsDropDown.field('rule_1_condition'))).toHaveTextContent(
        'Wait for carrier full before moving'
      );
    });
  });

  describe('interactions', () => {
    it('switches to edit mode after user clicks on "add rule"', async () => {
      // ACT 1
      const { queryByTestId } = renderRuleRow();

      // ASSERT 1
      expect(queryByTestId(dataTestIds.ruleClosedMode(1))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.ruleEditMode(1))).not.toBeInTheDocument();

      // ACT 2
      await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIds.addRuleButton)));

      // ASSERT 2
      expect(queryByTestId(dataTestIds.ruleClosedMode(1))).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.ruleEditMode(1))).toBeInTheDocument();
    });

    it('calls "onDelete" when user clicks on trash icon', async () => {
      // ARRANGE
      const mockFormik = {
        values: {
          ...getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel),
          rule_1_from: { value: 'GR1-1B' },
          rule_1_condition: { value: 'WAIT_FOR_CARRIER_FULL_BEFORE_MOVING' },
        },
        setFieldValue: jest.fn(),
      } as any;
      const mockOnDelete = jest.fn();

      // ACT 1
      const { queryByTestId } = renderRuleRow({
        formik: mockFormik,
        onDelete: mockOnDelete,
      });

      // ASSERT 1
      expect(queryByTestId(dataTestIds.ruleEditMode(1))).toBeInTheDocument();

      // ACT 2
      await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIds.deleteRuleButton(1))));

      // ASSERT 2
      expect(mockOnDelete).toHaveBeenCalledWith(expect.anything(), { ruleNumber });
    });

    it('calls "onChange" when user changes the dropdown', async () => {
      // ARRANGE
      const mockOnChange = jest.fn();
      const { queryByTestId } = renderRuleRow({
        onChange: mockOnChange,
      });
      await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIds.addRuleButton)));

      // ACT
      await actAndAwait(() =>
        fireEvent.mouseDown(queryByTestId(dataTestIdsDropDown.field('rule_1_from')).querySelector('[role="button"]'))
      );
      await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIdsDropDown.choice('aux-buffer-1'))));

      // ASSERT
      expect(mockOnChange).toHaveBeenCalledWith(expect.anything(), 'rule_1_from', 'aux-buffer-1');
    });
  });
});
