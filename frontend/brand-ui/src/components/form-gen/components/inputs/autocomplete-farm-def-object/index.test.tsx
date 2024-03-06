import { mockUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';

import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteFarmDefObject } from '.';

const options = makeOptions({});

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const onChange = jest.fn();
let formikProps;

describe('AutocompleteFarmDefObject', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
    onChange.mockRestore();

    mockUseSwrAxios.mockImplementation(mockUseSwrAxiosImpl);
    onChange.mockImplementation(object => object.path);
  });

  it("sets the site's path on the formik values", async () => {
    await renderFormGenInputAsync(
      AutocompleteFarmDefObject,
      options({ formGenField: { onChange }, setFormikProps: f => (formikProps = f) })
    );

    await actAndAwait(() => changeTextField('mockName', 'sites/SSF2'));

    expect(formikProps.values.mockName).toBe('sites/SSF2');
  });

  it("sets the site's path on the formik values", async () => {
    await renderFormGenInputAsync(
      AutocompleteFarmDefObject,
      options({
        formGenField: { onChange },
        setFormikProps: f => (formikProps = f),
        initialValues: { mockName: 'sites/SSF2' },
      })
    );

    expect(formikProps.values.mockName).toBe('sites/SSF2');
  });

  it('clears the formik values when clicking the clear button', async () => {
    const [{ queryByLabelText }] = await renderFormGenInputAsync(
      AutocompleteFarmDefObject,
      options({
        formGenField: { onChange },
        setFormikProps: f => (formikProps = f),
        initialValues: { mockName: 'sites/SSF2' },
      })
    );

    expect(formikProps.values.mockName).toBe('sites/SSF2');

    const clearButton = queryByLabelText('Clear');
    clearButton.click();

    expect(formikProps.values.mockName).toBe(null);
  });

  it('clears the formik values when deleting the input', async () => {
    await renderFormGenInputAsync(
      AutocompleteFarmDefObject,
      options({
        formGenField: { onChange },
        setFormikProps: f => (formikProps = f),
        initialValues: { mockName: 'sites/SSF2' },
      })
    );

    expect(formikProps.values.mockName).toBe('sites/SSF2');

    await actAndAwait(() => changeTextField('mockName', ''));

    expect(formikProps.values.mockName).toBe(null);
  });
});
