import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjcetUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import {
  chooseFromAutocomplete,
  chooseFromAutocompleteByIndex,
  chooseFromSelectByIndex,
  expectErrorOn,
  getInputByName,
  getSubmitButton,
  openAutocomplete,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait, buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { buildAlertRule, buildMetric } from '@plentyag/core/src/test-helpers/mocks/environment';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsDialogMetricPicker as dataTestIds, DialogMetricPicker } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const onChange = jest.fn();
const onClose = jest.fn();

const metric = buildMetric({ path: 'sites/SSF2', measurementType: 'VOLUME', observationName: 'SupplyTankVolume' });

const getUseSwrAxiosImple = metric => args => {
  if (!args || !args.url) {
    return { data: undefined, error: undefined, isValidating: false };
  }
  if (args.url.includes('list-metrics')) {
    return { data: buildPaginatedResponse([metric]), error: undefined, isValidating: false };
  }
  if (args.url.includes('get-measurement-types-for-path')) {
    return { data: [metric.measurementType], error: undefined, isValidating: false };
  }
  return mockAutocompleteFdsObjcetUseSwrAxiosImpl(args);
};

function renderDialogMetricPicker(props?: Partial<DialogMetricPicker>) {
  return render(
    <MemoryRouter>
      <DialogMetricPicker open onClose={onClose} onChange={onChange} {...props} />
    </MemoryRouter>
  );
}

describe('DialogMetricPicker', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockImplementation(getUseSwrAxiosImple(metric));
  });

  it('renders without a warning message', () => {
    const { queryByTestId } = renderDialogMetricPicker();

    expect(queryByTestId(dataTestIds.warning)).not.toBeInTheDocument();
  });

  it('renders with a warning message', () => {
    const warning = 'Attention!';

    const { queryByTestId } = renderDialogMetricPicker({ warning });

    expect(queryByTestId(dataTestIds.warning)).toHaveTextContent(warning);
  });

  it('renders without initial values', () => {
    renderDialogMetricPicker();

    expect(getInputByName('path')).toHaveValue('');
    expect(getInputByName('measurementType')).toHaveValue('');
    expect(getInputByName('metric')).toHaveValue('');
    expect(getInputByName('alertRule')).not.toBeInTheDocument();
  });

  it('renders with initial values', async () => {
    const { queryByTestId } = renderDialogMetricPicker({ metric });

    expect(getInputByName('path')).toHaveValue(getShortenedPath(metric.path, true));
    expect(getInputByName('measurementType')).toHaveValue(metric.measurementType);
    expect(getInputByName('metric')).toHaveValue(metric.observationName);
    expect(onChange).toHaveBeenCalledTimes(0);

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ metric, path: metric.path, measurementType: metric.measurementType })
    );
  });

  it('chooses a metric without alert rules', async () => {
    const { queryByTestId } = renderDialogMetricPicker({ renderAlertRule: alertRule => alertRule.id });

    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocomplete('SSF2'));
    await actAndAwait(() => fireEvent.blur(getInputByName('path')));
    await actAndAwait(() => openAutocomplete('measurementType'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    await actAndAwait(() => openAutocomplete('metric'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(onChange).toHaveBeenCalledTimes(0);
    expect(getInputByName('alertRule')).not.toBeInTheDocument();

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ metric, path: metric.path, measurementType: metric.measurementType })
    );
  });

  it('chooses a metric with its alert rule', async () => {
    const metricWithAlertRule = buildMetric({ ...metric, alertRules: [buildAlertRule({})] });
    mockUseSwrAxios.mockImplementation(getUseSwrAxiosImple(metricWithAlertRule));

    const { queryByTestId } = renderDialogMetricPicker({ renderAlertRule: alertRule => alertRule.id });

    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocomplete('SSF2'));
    await actAndAwait(() => fireEvent.blur(getInputByName('path')));
    await actAndAwait(() => openAutocomplete('measurementType'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => openAutocomplete('metric'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(onChange).toHaveBeenCalledTimes(0);
    expect(getInputByName('alertRule')).toBeInTheDocument();

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(onChange).toHaveBeenCalledTimes(0);
    expectErrorOn('alertRule');

    await actAndAwait(() => openSelect('alertRule'));
    await actAndAwait(() => chooseFromSelectByIndex(0));

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        metric: metricWithAlertRule,
        path: metricWithAlertRule.path,
        measurementType: metricWithAlertRule.measurementType,
      })
    );
  });
});
