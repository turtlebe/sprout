import {
  dataTestIdsDateRangePicker as dataTestIds,
  DateRangeValue,
} from '@plentyag/brand-ui/src/components/date-range-picker';
import { render } from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';

import { DateRangeField, MISSING_DATE_WARNING, OLD_DATE_WARNING } from './date-range-field';

function renderDateRangeField(harvestDates: DateRangeValue, labSampleType: string, disabled?: boolean) {
  const setWarning = () => {};
  const validate = () => {};
  const initialValues = {
    harvestDates: {},
  };
  return render(
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {() => {
        return (
          <Form>
            <DateRangeField
              className="test"
              fieldName="harvestDates"
              label="test"
              harvestDates={harvestDates}
              labSampleType={labSampleType}
              setWarning={setWarning}
              validate={validate}
              disabled={disabled}
            />
          </Form>
        );
      }}
    </Formik>
  );
}

describe('DataRangeField', () => {
  describe('old date warnings', () => {
    it('shows no warning for begin date after today', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dates = {
        begin: tomorrow,
        end: tomorrow,
      };
      const { queryByText } = renderDateRangeField(dates, 'Product');
      expect(queryByText(OLD_DATE_WARNING)).toBeFalsy();
      expect(queryByText(MISSING_DATE_WARNING)).toBeFalsy();
    });

    it('shows warning if begin date is today', () => {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dates = {
        begin: today,
        end: tomorrow,
      };
      const { queryByText } = renderDateRangeField(dates, 'Product');
      expect(queryByText(OLD_DATE_WARNING)).toBeTruthy();
    });

    it('shows warning for begin date before today', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date();
      const dates = {
        begin: yesterday,
        end: tomorrow,
      };
      const { queryByText } = renderDateRangeField(dates, 'Product');
      expect(queryByText(OLD_DATE_WARNING)).toBeTruthy();
    });

    it('disables the field', () => {
      const dates = {
        begin: new Date(),
        end: new Date(),
      };
      const { queryByTestId } = renderDateRangeField(dates, 'Product', true);
      expect(queryByTestId(dataTestIds.datePickerRoot).querySelector('input')).toBeDisabled();
    });

    it('enables the field', () => {
      const dates = {
        begin: new Date(),
        end: new Date(),
      };
      const { queryByTestId } = renderDateRangeField(dates, 'Product', false);
      expect(queryByTestId(dataTestIds.datePickerRoot).querySelector('input')).not.toBeDisabled();
    });
  });

  describe('missing date warnings', () => {
    it('shows warning when missing', () => {
      const dates = undefined;
      const { queryByText } = renderDateRangeField(dates, 'Product');
      expect(queryByText(MISSING_DATE_WARNING)).toBeTruthy();
    });

    it('shows no warning when sample type not product', () => {
      const dates = undefined;
      const { queryByText } = renderDateRangeField(dates, 'Water');
      expect(queryByText(OLD_DATE_WARNING)).toBeFalsy();
      expect(queryByText(MISSING_DATE_WARNING)).toBeFalsy();
    });
  });
});
