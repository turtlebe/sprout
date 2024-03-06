import { mockOverrideRoutingTableActionModel } from '@plentyag/app-production/src/actions-modules/test-helpers';
import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { actAndAwait, mockConsoleError } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { getInitialDataModelFromActionModel } from '../../utils';

import { dataTestIdsRadioGroup as dataTestIds, RadioGroup } from '.';

describe('RadioGroup', () => {
  const fieldName = 'rule_1_from';

  function renderRadioGroup(props?: Partial<ActionModuleProps & RadioGroup>) {
    const mockFormik = {
      values: getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel),
      setFieldValue: jest.fn(),
    } as any;

    return render(
      <RadioGroup formik={mockFormik} actionModel={mockOverrideRoutingTableActionModel} field={fieldName} {...props} />
    );
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('start state', () => {
    it('renders', () => {
      // ACT
      const { queryByTestId } = renderRadioGroup();

      // ASSERT
      expect(queryByTestId(dataTestIds.field(fieldName))).toBeInTheDocument();
    });

    it('shows error', () => {
      // ACT
      const { queryByTestId } = renderRadioGroup({
        isError: true,
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.field(fieldName)).querySelector('.Mui-error')).toBeInTheDocument();
    });

    it('does not show error if isError is passed but there is a new value', () => {
      // ARRANGE
      const mockFormik = {
        values: {
          ...getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel),
          [fieldName]: { value: 'GR2-3A' },
        },
        setFieldValue: jest.fn(),
      } as any;

      // ACT
      const { queryByTestId } = renderRadioGroup({
        isError: true,
        formik: mockFormik,
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.field(fieldName)).querySelector('.Mui-error')).not.toBeInTheDocument();
    });
  });

  describe('handling non-functional', () => {
    it('should show empty if formik is not ready', () => {
      // ARRANGE
      const mockFormik = { values: undefined } as any;

      // ACT
      const { queryByTestId } = renderRadioGroup({
        formik: mockFormik,
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.field(fieldName))).not.toBeInTheDocument();
    });

    it('should show empty if action model is not ready', () => {
      // ACT
      const { queryByTestId } = renderRadioGroup({
        actionModel: undefined,
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.field(fieldName))).not.toBeInTheDocument();
    });

    it('should log error and show empty if field is not found in action model', () => {
      // ARRANGE
      const consoleError = mockConsoleError();

      // ACT
      const { queryByTestId } = renderRadioGroup({
        field: 'unknown_field',
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.field(fieldName))).not.toBeInTheDocument();
      expect(consoleError).toHaveBeenCalledWith(
        'Field "unknown_field" is not found in this Action "Override Routing Table"',
        expect.anything()
      );
    });
  });

  describe('interactions', () => {
    it('formatChoiceLabel => can show reformatted choice', async () => {
      // ARRANGE
      const { queryByTestId } = renderRadioGroup({
        field: 'rule_2_condition',
        formatChoiceLabel: str => `CUSTOM FORMAT ${str.toLowerCase()}`,
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.choice('WAIT_FOR_CARRIER_FULL_BEFORE_MOVING'))).toHaveTextContent(
        'CUSTOM FORMAT wait_for_carrier_full_before_moving'
      );
    });

    it('should set values on formik and callback onChange', async () => {
      // ARRANGE
      const mockSetFieldValue = jest.fn();
      const mockFormik = {
        values: getInitialDataModelFromActionModel(mockOverrideRoutingTableActionModel),
        setFieldValue: mockSetFieldValue,
      } as any;
      const mockOnChange = jest.fn();

      const { queryByTestId } = renderRadioGroup({
        formik: mockFormik,
        onChange: mockOnChange,
      });

      // ACT
      await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIds.choice('aux-buffer-1'))));

      // ASSERT
      expect(mockSetFieldValue).toHaveBeenCalledWith(fieldName, {
        value: 'aux-buffer-1',
      });
      expect(mockOnChange).toHaveBeenCalledWith(expect.anything(), fieldName, 'aux-buffer-1');
    });
  });
});
