import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { fireEvent } from '@testing-library/react';
import * as yup from 'yup';

import { makeOptions, renderFormGenInput } from '../test-helpers';

import { dataTestIds, getTrayIdRecordURL, TRAY_ID_PERMISSION_ERROR, TrayIdDecoder } from '.';
import { TRAY_ID_ERROR } from './index';

jest.mock('@plentyag/core/src/utils/request');

const mockAxiosRequest = axiosRequest as jest.Mock;
const options = makeOptions({
  formGenField: {
    mapProductTo: 'cultivar',
  },
});
const MOCK_TRAY_ID_RECORD = {
  encoded: {
    trayId: 'P900-0008529A:ABCD-EFGH-X4',
    product: 'GRC',
  },
  decoded: {
    data: {
      id: 'P900-0008529A:ABCD-EFGH-X4',
      materialObj: {
        id: '64b3367c-dff3-489a-9e5c-840c1f663d65',
        lotName: '124783a1-b407-4698-b2ae-27614a529c60',
        materialType: 'LOADED_TRAY',
        product: 'GRC',
        createdAt: '2021-11-16T15:41:47.551Z',
        updatedAt: '2021-11-16T15:41:47.551Z',
        properties: {},
      },
    },
  },
};

describe('TrayIdDecoder', () => {
  let formikProps;
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('validates on blur', async () => {
    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(TrayIdDecoder);
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
      TrayIdDecoder,
      options({ initialValues: { mockName: MOCK_TRAY_ID_RECORD.encoded.trayId } })
    );
    const input = getByTestId(formGenField.name).querySelector('input');

    expect(input).toHaveValue(MOCK_TRAY_ID_RECORD.encoded.trayId);
  });

  it('resolves the current input value', async () => {
    mockAxiosRequest.mockResolvedValue(MOCK_TRAY_ID_RECORD.decoded);

    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      TrayIdDecoder,
      options({ setFormikProps: f => (formikProps = f) })
    );
    const validate = jest.fn().mockReturnValue(true);
    formikProps.registerField('cultivar', { validate });
    const input = getByTestId(formGenField.name).querySelector('input');

    expect(formikProps.values.cultivar).toBeUndefined();

    await actAndAwait(() => {
      changeTextField(input, JSON.stringify(MOCK_TRAY_ID_RECORD.encoded));
      jest.runAllTimers();
    });
    expect(input).toHaveValue(MOCK_TRAY_ID_RECORD.encoded.trayId);
    expect(formikProps.values.cultivar).toBe(MOCK_TRAY_ID_RECORD.decoded.data.materialObj.product);
    expect(validateField).toHaveBeenCalledWith(MOCK_TRAY_ID_RECORD.encoded.trayId);
    expect(mockAxiosRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: getTrayIdRecordURL(MOCK_TRAY_ID_RECORD.encoded.trayId),
    });
  });

  it('resolves the tray ID attribute of a json payload', async () => {
    mockAxiosRequest.mockResolvedValue(MOCK_TRAY_ID_RECORD.decoded);

    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      TrayIdDecoder,
      options({ setFormikProps: f => (formikProps = f) })
    );
    const validate = jest.fn().mockReturnValue(true);
    formikProps.registerField('cultivar', { validate });
    const input = getByTestId(formGenField.name).querySelector('input');

    expect(formikProps.values.cultivar).toBeUndefined();
    expect(formikProps.values.caseType).toBeUndefined();

    await actAndAwait(() => {
      changeTextField(input, MOCK_TRAY_ID_RECORD.encoded.trayId);
      jest.runAllTimers();
    });

    expect(input).toHaveValue(MOCK_TRAY_ID_RECORD.encoded.trayId);
    expect(formikProps.values.cultivar).toBe(MOCK_TRAY_ID_RECORD.decoded.data.materialObj.product);
    expect(validateField).toHaveBeenCalledWith(MOCK_TRAY_ID_RECORD.encoded.trayId);
    expect(mockAxiosRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: getTrayIdRecordURL(MOCK_TRAY_ID_RECORD.encoded.trayId),
    });
  });

  it('shows a loader while resolving the Tray Id', async () => {
    mockAxiosRequest.mockImplementation(
      async () => new Promise(resolve => setTimeout(() => resolve(MOCK_TRAY_ID_RECORD.decoded), 10_000))
    );

    const [{ getByTestId, queryByTestId }, { formGenField }] = renderFormGenInput(
      TrayIdDecoder,
      options({ setFormikProps: f => (formikProps = f) })
    );
    const validate = jest.fn().mockReturnValue(true);
    formikProps.registerField('cultivar', { validate });
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

  it('shows an error when get-state-by-id returns 404', async () => {
    mockAxiosRequest.mockRejectedValue({ isAxiosError: true, response: { status: 404 } });

    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      TrayIdDecoder,
      options({ setFormikProps: f => (formikProps = f) })
    );
    const input = getByTestId(formGenField.name).querySelector('input');

    expect(formikProps.values.cultivar).toBeUndefined();

    await actAndAwait(() => changeTextField(input, 'wrong-tray-id'));

    expect(input).toHaveValue('wrong-tray-id');

    await actAndAwait(() => jest.runAllTimers()); // execute debounce

    expect(getByTestId(formGenField.name).querySelector('p.MuiFormHelperText-root.Mui-error')).toHaveTextContent(
      TRAY_ID_ERROR
    );

    expect(mockAxiosRequest).toHaveBeenCalledWith({ method: 'GET', url: getTrayIdRecordURL('wrong-tray-id') });
  });

  it('shows an error when get-state-by-id returns 404 with custom error message', async () => {
    mockAxiosRequest.mockRejectedValue({ isAxiosError: true, response: { status: 404 } });
    const errorMsg = 'This is custom error message';
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      TrayIdDecoder,
      options({ formGenField: { errorMessage: errorMsg }, setFormikProps: f => (formikProps = f) })
    );
    const input = getByTestId(formGenField.name).querySelector('input');

    expect(formikProps.values.cultivar).toBeUndefined();

    await actAndAwait(() => changeTextField(input, 'wrong-tray-id'));

    expect(input).toHaveValue('wrong-tray-id');

    await actAndAwait(() => jest.runAllTimers()); // execute debounce

    expect(getByTestId(formGenField.name).querySelector('p.MuiFormHelperText-root.Mui-error')).toHaveTextContent(
      errorMsg
    );
  });

  it('shows an error when get-state-by-id returns 403', async () => {
    mockAxiosRequest.mockRejectedValue({ isAxiosError: true, response: { status: 403 } });

    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      TrayIdDecoder,
      options({ setFormikProps: f => (formikProps = f) })
    );
    const input = getByTestId(formGenField.name).querySelector('input');

    expect(formikProps.values.cultivar).toBeUndefined();

    await actAndAwait(() => changeTextField(input, 'wrong-tray-id'));

    expect(input).toHaveValue('wrong-tray-id');

    await actAndAwait(() => jest.runAllTimers()); // execute debounce

    expect(getByTestId(formGenField.name).querySelector('p.MuiFormHelperText-root.Mui-error')).toHaveTextContent(
      TRAY_ID_PERMISSION_ERROR
    );

    expect(mockAxiosRequest).toHaveBeenCalledWith({ method: 'GET', url: getTrayIdRecordURL('wrong-tray-id') });
  });

  it('cleanup both fields when the user clears the tray id', async () => {
    mockAxiosRequest.mockResolvedValue(MOCK_TRAY_ID_RECORD.decoded);

    const [{ getByTestId }, { formGenField, validateField }] = renderFormGenInput(
      TrayIdDecoder,
      options({ setFormikProps: f => (formikProps = f) })
    );
    const validate = jest.fn().mockReturnValue(true);
    formikProps.registerField('cultivar', { validate });
    const input = getByTestId(formGenField.name).querySelector('input');

    expect(formikProps.values.cultivar).toBeUndefined();

    await actAndAwait(() => {
      changeTextField(input, JSON.stringify(MOCK_TRAY_ID_RECORD.encoded));
      jest.runAllTimers();
    });
    expect(input).toHaveValue(MOCK_TRAY_ID_RECORD.encoded.trayId);
    expect(formikProps.values.cultivar).toBe(MOCK_TRAY_ID_RECORD.decoded.data.materialObj.product);
    expect(validateField).toHaveBeenCalledWith(MOCK_TRAY_ID_RECORD.encoded.trayId);
    expect(mockAxiosRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: getTrayIdRecordURL(MOCK_TRAY_ID_RECORD.encoded.trayId),
    });

    await actAndAwait(() => {
      changeTextField(input, '');
      jest.runAllTimers();
    });
    expect(input).toHaveValue('');
    expect(input).toHaveValue('');
  });

  it('does not decorate the label with "*" when not required with yup', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(TrayIdDecoder, options());
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).not.toHaveTextContent(`${formGenField.label} *`);
  });

  it('decorates the label with "*" when required with yup', () => {
    const [{ getByTestId }, { formGenField }] = renderFormGenInput(
      TrayIdDecoder,
      options({ formGenField: { validate: yup.mixed().required() } })
    );
    const label = getByTestId(formGenField.name).querySelector('label');

    expect(label).toHaveTextContent(`${formGenField.label} *`);
  });
});
