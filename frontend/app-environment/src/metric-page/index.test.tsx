import { mockAlertRules, mockMetrics, mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import {
  useDeleteRequest,
  useMeasure,
  usePostRequest,
  usePutRequest,
  useQueryParam,
  useSwrAxios,
} from '@plentyag/core/src/hooks';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';

import { EVS_URLS } from '../common/utils';

import { dataTestIdsMetricPage as dataTestIds } from '.';

import { dataTestIdsTableAlertRuleEdit } from './components';
import { getMockUseSwrAxiosImplementation, renderMetricPage } from './test-helper';

// mocking `drawHandleInfo` because it contains d3 instructions not available in the jest environment.
jest.mock('@plentyag/app-environment/src/common/utils/d3/draw-handle-info');
jest.mock('@plentyag/core/src/utils/request');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-query-param');
jest.mock('@plentyag/core/src/hooks/use-measure');
jest.mock('@plentyag/core/src/core-store');

const mockAxiosRequest = axiosRequest as jest.Mock;
const mockUseDeleteRequest = useDeleteRequest as jest.Mock;
const mockUseMeasure = useMeasure as jest.Mock;
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseQueryParam = useQueryParam as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

const makeDeleteRequest = jest.fn();
const makePostRequest = jest.fn();
const makePutRequest = jest.fn();

mockCurrentUser();
mockUseFetchMeasurementTypes();

function mockRequests() {
  makeDeleteRequest.mockImplementation(({ onSuccess }) => onSuccess && onSuccess());
  makePostRequest.mockImplementation(({ onSuccess }) => onSuccess && onSuccess());
  mockUseDeleteRequest.mockReturnValue({ makeRequest: makeDeleteRequest });
  mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: makePostRequest });
  mockUsePutRequest.mockReturnValue({ makeRequest: makePutRequest });
  mockUseQueryParam.mockReturnValue(new URLSearchParams(''));
}

describe('MetricPage', () => {
  beforeEach(() => {
    mockAxiosRequest.mockRestore();
    mockUseDeleteRequest.mockRestore();
    mockUseMeasure.mockReturnValue({ width: 1000, height: 800 });
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseQueryParam.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  it('renders with a loading state', () => {
    mockRequests();
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true, error: undefined });

    const { queryByTestId } = renderMetricPage();

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
  });

  it('renders with an empty placeholder', () => {
    mockRequests();
    const [metric] = mockMetrics;
    mockUseSwrAxios.mockImplementation(getMockUseSwrAxiosImplementation({ metric }));

    const { container, queryByTestId } = renderMetricPage();

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(container).toHaveTextContent('No Alert Rules.');
    expect(container).toHaveTextContent('Add Alert Rule');
  });

  it('changes the URL to target the first alert-rule', () => {
    mockRequests();
    const metric = { ...mockMetrics[0], alertRules: mockAlertRules };
    mockUseSwrAxios.mockImplementation(getMockUseSwrAxiosImplementation({ metric }));

    const { history, container, queryByTestId } = renderMetricPage();

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent('Add Alert Rule');
    expect(history.entries).toHaveLength(2);
    expect(history.entries[1].pathname).toContain(`/metrics/metric-id/alert-rule/${mockAlertRules[0].id}`);
    expect(queryByTestId(dataTestIds.alertRuleTab(mockAlertRules[0]))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.alertRuleTab(mockAlertRules[0]))).toHaveAttribute('aria-selected', 'true');
  });

  it('switches the page in Edit mode', () => {
    mockRequests();
    const [schedule] = mockSchedules;
    const metric = { ...mockMetrics[0], alertRules: mockAlertRules };
    mockUseSwrAxios.mockImplementation(getMockUseSwrAxiosImplementation({ metric, schedule }));

    const { queryByTestId } = renderMetricPage();

    function expectReadMode() {
      expect(queryByTestId(dataTestIds.windowDateTimePicker)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.dropdown.root)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly(mockAlertRules[0]))).toBeInTheDocument();

      expect(queryByTestId(dataTestIds.cancel)).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.save)).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.tableAlertRuleEdit(mockAlertRules[0]))).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.tableAlertRuleEdit(mockAlertRules[1]))).not.toBeInTheDocument();
    }

    function expectEditMode() {
      expect(queryByTestId(dataTestIds.windowDateTimePicker)).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.dropdown.root)).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly(mockAlertRules[0]))).not.toBeInTheDocument();

      expect(queryByTestId(dataTestIds.cancel)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.save)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.tableAlertRuleEdit(mockAlertRules[0]))).toBeInTheDocument();
    }

    expectReadMode();

    queryByTestId(dataTestIds.dropdown.root).click();
    queryByTestId(dataTestIds.dropdown.editRules).click();

    expectEditMode();

    queryByTestId(dataTestIds.cancel).click();

    queryByTestId(dataTestIds.scheduleTab(schedule)).click();

    expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly(mockAlertRules[0]))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.scheduleTabPanel(schedule))).toBeInTheDocument();

    queryByTestId(dataTestIds.dropdown.root).click();
    queryByTestId(dataTestIds.dropdown.editRules).click();

    expectEditMode();
  });

  it('updates the AlertRule', async () => {
    mockRequests();
    const [schedule] = mockSchedules;
    const metric = { ...mockMetrics[0], alertRules: mockAlertRules };
    mockUseSwrAxios.mockImplementation(getMockUseSwrAxiosImplementation({ metric, schedule }));

    const { queryByTestId } = renderMetricPage();

    function expectReadMode() {
      expect(queryByTestId(dataTestIds.windowDateTimePicker)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.dropdown.root)).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly(mockAlertRules[0]))).toBeInTheDocument();

      expect(queryByTestId(dataTestIds.cancel)).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.save)).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.tableAlertRuleEdit(mockAlertRules[0]))).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.tableAlertRuleEdit(mockAlertRules[1]))).not.toBeInTheDocument();
    }

    expectReadMode();

    queryByTestId(dataTestIds.dropdown.root).click();
    queryByTestId(dataTestIds.dropdown.editRules).click();

    expect(queryByTestId(dataTestIds.windowDateTimePicker)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dropdown.root)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleReadOnly(mockAlertRules[0]))).not.toBeInTheDocument();

    expect(queryByTestId(dataTestIds.cancel)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.save)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableAlertRuleEdit(mockAlertRules[0]))).toBeInTheDocument();

    changeTextField(dataTestIdsTableAlertRuleEdit.cellMin(0), 100);

    await actAndAwait(() => queryByTestId(dataTestIds.save).click());

    expect(mockAxiosRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: EVS_URLS.alertRules.updateUrl(mockAlertRules[0]),
      })
    );

    expectReadMode();
  }, 15000);
});
