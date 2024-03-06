import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjectUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { openAutocomplete } from '@plentyag/brand-ui/src/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsMetricsSelector as dataTestIds, MetricsSelector } from '.';

import { dataTestIdsListMetrics } from './components/list-metrics';
import { metrics } from './test-helpers/mocks';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const onChange = jest.fn();

const id = 'mock-id';
const label = 'mock-label';
const error = 'mock-error';
const subsetMetrics = buildPaginatedResponse([metrics[0], metrics[2]]);

describe('MetricsSelector', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      // this is for the "renders an Autocomplete with selected Metrics" test.
      if (args.url.includes('search-metrics') && args.data?.ids) {
        return {
          data: subsetMetrics,
          isValidating: false,
        };
      }

      if (args.url.includes('search-metrics')) {
        return { data: buildPaginatedResponse(metrics), isValidating: false };
      }

      return mockAutocompleteFdsObjectUseSwrAxiosImpl(args);
    });
    onChange.mockRestore();
  });

  it('renders an Autocomplete component', () => {
    const { queryByTestId } = render(<MetricsSelector id={id} label={label} />);

    expect(queryByTestId(id).querySelector('label')).toHaveTextContent(label);
  });

  it('renders an Autocomplete component with an error', () => {
    const { queryByTestId } = render(<MetricsSelector id={id} label={label} error={error} />);

    expect(queryByTestId(id).querySelector('label')).toHaveClass('Mui-error');
    expect(queryByTestId(id).querySelector('p')).toHaveClass('Mui-error');
    expect(queryByTestId(id).querySelector('p')).toHaveTextContent(error);
  });

  it('chooses a couple of metrics', () => {
    const { queryByTestId, queryByRole } = render(<MetricsSelector id={id} label={label} onChange={onChange} />);

    expect(queryByRole('dialog')).not.toBeInTheDocument();

    openAutocomplete(id);

    expect(queryByRole('dialog')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    queryByTestId(dataTestIdsListMetrics.item(metrics[0])).click();

    expect(onChange).toHaveBeenNthCalledWith(1, [metrics[0].id]);

    queryByTestId(dataTestIds.close).click();

    expect(queryByRole('dialog')).not.toBeVisible();

    fireEvent.click(document.querySelector<HTMLButtonElement>('.MuiChip-deleteIcon'));

    expect(onChange).toHaveBeenNthCalledWith(2, []);
  });

  it('renders an Autocomplete with selected Metrics', () => {
    const { queryAllByRole } = render(
      <MetricsSelector id={id} label={label} onChange={onChange} metricIds={[metrics[0].id, metrics[2].id]} />
    );

    expect(queryAllByRole('button')[0]).toHaveTextContent(metrics[0].path.split('/').slice(-1).toString());
    expect(queryAllByRole('button')[0]).toHaveTextContent(metrics[0].observationName);
    expect(queryAllByRole('button')[1]).toHaveTextContent(metrics[2].path.split('/').slice(-1).toString());
    expect(queryAllByRole('button')[1]).toHaveTextContent(metrics[2].observationName);
  });
});
