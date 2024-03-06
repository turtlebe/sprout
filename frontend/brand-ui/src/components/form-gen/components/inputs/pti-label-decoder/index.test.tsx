import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { fireEvent } from '@testing-library/react';
import * as yup from 'yup';

import { makeOptions, renderFormGenInput } from '../test-helpers';

import { dataTestIds, getPtiRecordUrl, PtiLabelDecoder } from '.';

jest.mock('@plentyag/core/src/utils/request');

const mockAxiosRequest = axiosRequest as jest.Mock;
const options = makeOptions({
  formGenField: {
    mapProductTo: 'crop',
    mapUnitTypeTo: 'caseType',
  },
});
const MOCK_PTI_RECORD = {
  encoded: {
    gtin: '10810567030412',
    item: '5-004-0002-06',
    lot: '3-TIGRIS-B11-216',
    internalExpirationDate: '2020-08-07',
    caseId: '101d72cc-0e73-4bab-9d3d-343805521203',
  },
  decoded: { data: { product: 'B10', unitType: 'BULK_1LB' } },
};
let formikProps;

describe('PtiLabelDecoder', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('validates on blur', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(PtiLabelDecoder);
    const input = getByTestId(formGenField.name).querySelector('input');
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(input).toHaveValue('');
    expect(label).toHaveTextContent(formGenField.label);
    expect(input).toHaveAttribute('id', formGenField.name);
    expect(input).toHaveAttribute('name', formGenField.name);

    await actAndAwait(() => fireEvent.blur(input));

    expect(validateField).toHaveBeenCalledWith(undefined);
  });

  it('initializes the input', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      PtiLabelDecoder,
      options({ initialValues: { mockName: MOCK_PTI_RECORD.encoded.caseId } })
    );
    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue(MOCK_PTI_RECORD.encoded.caseId);
  });

  it('resolves the current input value', async () => {
    mockAxiosRequest.mockResolvedValue(MOCK_PTI_RECORD.decoded);

    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      PtiLabelDecoder,
      options({ setFormikProps: f => (formikProps = f) })
    );
    const validate = jest.fn().mockReturnValue(true);
    formikProps.registerField('crop', { validate });
    formikProps.registerField('caseType', { validate });
    const input = getByTestId(formGenField.name).querySelector('input');

    expect(formikProps.values.crop).toBeUndefined();
    expect(formikProps.values.caseType).toBeUndefined();

    await actAndAwait(() => {
      changeTextField(input, JSON.stringify(MOCK_PTI_RECORD.encoded));
      jest.runAllTimers();
    });

    expect(input).toHaveValue(MOCK_PTI_RECORD.encoded.caseId);
    expect(formikProps.values.crop).toBe(MOCK_PTI_RECORD.decoded.data.product);
    expect(formikProps.values.caseType).toBe(MOCK_PTI_RECORD.decoded.data.unitType);
    expect(validateField).toHaveBeenCalledWith(MOCK_PTI_RECORD.encoded.caseId);
    expect(mockAxiosRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: getPtiRecordUrl(MOCK_PTI_RECORD.encoded.caseId),
    });
  });

  it('resolves the case ID attribute of a json payload', async () => {
    mockAxiosRequest.mockResolvedValue(MOCK_PTI_RECORD.decoded);

    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      PtiLabelDecoder,
      options({ setFormikProps: f => (formikProps = f) })
    );
    const validate = jest.fn().mockReturnValue(true);
    formikProps.registerField('crop', { validate });
    formikProps.registerField('caseType', { validate });
    const input = getByTestId(formGenField.name).querySelector('input');

    expect(formikProps.values.crop).toBeUndefined();
    expect(formikProps.values.caseType).toBeUndefined();

    await actAndAwait(() => {
      changeTextField(input, MOCK_PTI_RECORD.encoded.caseId);
      jest.runAllTimers();
    });

    expect(input).toHaveValue(MOCK_PTI_RECORD.encoded.caseId);
    expect(formikProps.values.crop).toBe(MOCK_PTI_RECORD.decoded.data.product);
    expect(formikProps.values.caseType).toBe(MOCK_PTI_RECORD.decoded.data.unitType);
    expect(validateField).toHaveBeenCalledWith(MOCK_PTI_RECORD.encoded.caseId);
    expect(mockAxiosRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: getPtiRecordUrl(MOCK_PTI_RECORD.encoded.caseId),
    });
  });

  it('shows a loader while resolving the PTI label', async () => {
    mockAxiosRequest.mockImplementation(
      async () => new Promise(resolve => setTimeout(() => resolve(MOCK_PTI_RECORD.decoded), 10_000))
    );

    const [{ getByTestId, queryByTestId }, { formGenField }] = renderFormGenInput(
      PtiLabelDecoder,
      options({ setFormikProps: f => (formikProps = f) })
    );
    const validate = jest.fn().mockReturnValue(true);
    formikProps.registerField('crop', { validate });
    formikProps.registerField('caseType', { validate });
    const input = getByTestId(formGenField.name).querySelector('input');

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();

    await actAndAwait(() => {
      changeTextField(input, 'new-value');
      jest.advanceTimersByTime(1000); // execute debounce
    });

    expect(getByTestId(dataTestIds.loader)).toBeVisible();

    await actAndAwait(() => jest.runAllTimers()); // execute axios promise

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
  });

  it('clears the input when get-pti-record returns 404', async () => {
    mockAxiosRequest.mockRejectedValue({ isAxiosError: true, response: { status: 404 } });

    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      PtiLabelDecoder,
      options({ setFormikProps: f => (formikProps = f) })
    );
    const input = getByTestId(formGenField.name).querySelector('input');

    expect(formikProps.values.crop).toBeUndefined();
    expect(formikProps.values.caseType).toBeUndefined();

    await actAndAwait(() => changeTextField(input, 'wrong-case-id'));

    expect(input).toHaveValue('wrong-case-id');

    await actAndAwait(() => jest.runAllTimers()); // execute debounce

    expect(input).toHaveValue('');
    expect(formikProps.values.crop).toBeUndefined();
    expect(formikProps.values.caseType).toBeUndefined();
    expect(validateField).toHaveBeenCalledWith('');
    expect(mockAxiosRequest).toHaveBeenCalledWith({ method: 'GET', url: getPtiRecordUrl('wrong-case-id') });
  });

  it('does not decorate the label with "*" when not required with yup', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(PtiLabelDecoder, options());
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).not.toHaveTextContent(`${formGenField.label} *`);
  });

  it('decorates the label with "*" when required with yup', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      PtiLabelDecoder,
      options({ formGenField: { validate: yup.mixed().required() } })
    );
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });
});
