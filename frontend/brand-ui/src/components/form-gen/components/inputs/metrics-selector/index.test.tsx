import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjectUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { dataTestIdsMetricsSelector as dataTestIds } from '@plentyag/brand-ui/src/components/metrics-selector';
import { addMetric, metrics, removeMetric } from '@plentyag/brand-ui/src/components/metrics-selector/test-helpers';
import { openAutocomplete } from '@plentyag/brand-ui/src/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait, buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import * as yup from 'yup';

import { makeOptions, mockFormikProps, renderFormGenInputAsync } from '../test-helpers';

import { MetricsSelector } from '.';

const options = makeOptions({});

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
let formikProps;

describe('MetricsSelector', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();

    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      if (args.url.includes('search-metrics')) {
        return { data: buildPaginatedResponse(metrics), isValidating: false };
      }

      return mockAutocompleteFdsObjectUseSwrAxiosImpl(args);
    });
  });

  it('adds metric ids to the formik values', async () => {
    await renderFormGenInputAsync(MetricsSelector, options({ setFormikProps: f => (formikProps = f) }));

    await actAndAwait(() => openAutocomplete('mockName'));
    await actAndAwait(() => addMetric(0));
    await actAndAwait(() => addMetric(1));

    expect(formikProps.values.mockName).toEqual([metrics[2].id, metrics[0].id]);
  });

  it('intitialize the MetricsSelector with the selected metrics', async () => {
    await renderFormGenInputAsync(
      MetricsSelector,
      options({ initialValues: { mockName: metrics.map(metric => metric.id) }, setFormikProps: f => (formikProps = f) })
    );

    expect(formikProps.values.mockName).toEqual(metrics.map(metric => metric.id));

    await actAndAwait(() => openAutocomplete('mockName'));
    await actAndAwait(() => removeMetric(0));

    expect(formikProps.values.mockName).toEqual([metrics[1].id, metrics[2].id]);
  });

  it('runs validations when closing the dialog', async () => {
    const [{ queryByTestId }] = await renderFormGenInputAsync(
      MetricsSelector,
      options({ formGenField: { validate: yup.mixed().required() }, setFormikProps: f => (formikProps = f) })
    );

    const label = queryByTestId('mockName').querySelector('label');

    expect(label).not.toHaveClass('Mui-error');

    await actAndAwait(() => openAutocomplete('mockName'));
    await actAndAwait(() => queryByTestId(dataTestIds.close).click());

    expect(label).toHaveClass('Mui-error');
  });

  it('re-render the MetricsSelector when the formik values changes externally', () => {
    const formGenField: FormGen.FieldMetricsSelector = {
      type: 'MetricsSelector',
      name: 'mockName',
      label: 'Mock Label',
    };
    const formikProps = mockFormikProps({ formGenField });

    const { queryByTestId, rerender } = render(
      <MetricsSelector formGenField={formGenField} formikProps={formikProps} />
    );

    expect(queryByTestId('mockName').querySelector('[role="button"]')).not.toBeInTheDocument();

    const formikProps2 = mockFormikProps({ formGenField, value: metrics.map(metric => metric.id) });
    rerender(<MetricsSelector formGenField={formGenField} formikProps={formikProps2} />);

    expect(queryByTestId('mockName').querySelectorAll('[role="button"]')[0]).toHaveTextContent(
      metrics[0].path.split('/').slice(-1).toString()
    );
  });
});
