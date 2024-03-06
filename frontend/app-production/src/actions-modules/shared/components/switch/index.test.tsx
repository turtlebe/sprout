import { mockExecutionModeActionModel } from '@plentyag/app-production/src/actions-modules/test-helpers';
import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { getInitialDataModelFromActionModel } from '../../utils';

import { dataTestIdsSwitch as dataTestIds, Switch } from '.';

describe('Switch', () => {
  const fieldName = 'default_behavior_execution_mode';

  function renderSwitch(props?: Partial<ActionModuleProps & Switch>) {
    const mockFormik = {
      values: getInitialDataModelFromActionModel(mockExecutionModeActionModel),
      setFieldValue: jest.fn(),
    } as any;

    return render(
      <Switch formik={mockFormik} actionModel={mockExecutionModeActionModel} field={fieldName} {...props} />
    );
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('start state', () => {
    it('renders', () => {
      // ACT
      const { queryByTestId } = renderSwitch();

      // ASSERT
      expect(queryByTestId(dataTestIds.field(fieldName))).toBeInTheDocument();
    });
  });

  describe('handling non-functional', () => {
    it('should show empty if formik is not ready', () => {
      // ARRANGE
      const mockFormik = { values: undefined } as any;

      // ACT
      const { queryByTestId } = renderSwitch({
        formik: mockFormik,
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.field(fieldName))).not.toBeInTheDocument();
    });

    it('should show empty if action model is not ready', () => {
      // ACT
      const { queryByTestId } = renderSwitch({
        actionModel: undefined,
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.field(fieldName))).not.toBeInTheDocument();
    });

    it('should log error and show empty if field is not found in action model', () => {
      // ARRANGE
      const consoleError = mockConsoleError();

      // ACT
      const { queryByTestId } = renderSwitch({
        field: 'unknown_field',
      });

      // ASSERT
      expect(queryByTestId(dataTestIds.field(fieldName))).not.toBeInTheDocument();
      expect(consoleError).toHaveBeenCalledWith(
        'Field "unknown_field" is not found in this Action "Set Transfer Conveyance Default Behavior Execution Mode"',
        expect.anything()
      );
    });
  });

  describe('interactions', () => {
    it('should show as checked if positive value is set and when clicked will set the opposite', () => {
      // ARRANGE
      const mockSetFieldValue = jest.fn();
      const mockFormik = {
        values: {
          ...getInitialDataModelFromActionModel(mockExecutionModeActionModel),
          default_behavior_execution_mode: { value: 'EXECUTE_DEFAULT_BEHAVIORS' },
        },
        setFieldValue: mockSetFieldValue,
      } as any;

      // ACT 1
      const { queryByTestId } = renderSwitch({
        formik: mockFormik,
      });

      // ASSERT 1
      expect(queryByTestId(dataTestIds.field(fieldName)).querySelector('input')).toBeChecked();

      // ACT 2
      fireEvent.click(queryByTestId(dataTestIds.field(fieldName)).querySelector('input'));

      // ASSERT 2
      expect(mockSetFieldValue).toHaveBeenCalledWith(fieldName, {
        value: 'DO_NOT_EXECUTE_DEFAULT_BEHAVIORS',
      });
    });

    it('should show as unchecked if negative value is set and when clicked will set the opposite', () => {
      // ARRANGE
      const mockSetFieldValue = jest.fn();
      const mockFormik = {
        values: {
          ...getInitialDataModelFromActionModel(mockExecutionModeActionModel),
          default_behavior_execution_mode: { value: 'DO_NOT_EXECUTE_DEFAULT_BEHAVIORS' },
        },
        setFieldValue: mockSetFieldValue,
      } as any;

      // ACT 1
      const { queryByTestId } = renderSwitch({
        formik: mockFormik,
      });

      // ASSERT 1
      expect(queryByTestId(dataTestIds.field(fieldName)).querySelector('input')).not.toBeChecked();

      // ACT 2
      fireEvent.click(queryByTestId(dataTestIds.field(fieldName)).querySelector('input'));

      // ASSERT 2
      expect(mockSetFieldValue).toHaveBeenCalledWith(fieldName, {
        value: 'EXECUTE_DEFAULT_BEHAVIORS',
      });
    });
  });
});
