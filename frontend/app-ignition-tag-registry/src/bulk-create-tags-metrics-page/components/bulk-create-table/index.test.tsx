import { useSwrAxiosImpl } from '@plentyag/app-ignition-tag-registry/src/common/test-helpers';
import { dataTestIdsGroupRenderer } from '@plentyag/brand-ui/src/components/form-gen/components/group-renderer';
import { getSubmitButton } from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { axiosRequest } from '@plentyag/core/src/utils/request';

import { EVS_METRIC_ALREADY_EXISTS, FDS_TAG_ALREADY_EXISTS } from '.';

import { changeValues, expectValues, renderBulkCreateTable } from './test-helpers';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/utils/request');

const customTimeout = 1000 * 40;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockAxiosRequest = axiosRequest as jest.Mock;

const tag1 = {
  path: 'sites/LAR1',
  tagProvider: 'alpha seeder',
  tagPath: 'crane/crane/actposition',
  deviceType: '',
  measurementType: 'ELECTRICAL_CONDUCTIVITY',
  measurementUnit: 'MSIEMENS_PER_CM',
  measurementName: 'SupplyEC',
  createdBy: 'olittle',
};
const metric1 = {
  path: 'sites/LAR1',
  measurementType: 'ELECTRICAL_CONDUCTIVITY',
  observationName: 'SupplyEC',
  unitConfig: {
    min: 20,
    max: 40,
  },
  createdBy: 'olittle',
};
const tag2 = {
  path: 'sites/SSF2',
  tagProvider: 'alphacleaner',
  tagPath: 'crane/crane/destination',
  deviceType: '',
  measurementType: 'TEMPERATURE',
  measurementUnit: 'C',
  measurementName: 'AirTemperature',
  createdBy: 'olittle',
};
const metric2 = {
  path: 'sites/SSF2',
  measurementType: 'TEMPERATURE',
  observationName: 'AirTemperature',
  unitConfig: {
    min: 60,
    max: 80,
  },
  createdBy: 'olittle',
};

const dataTestIds = {
  ...dataTestIdsGroupRenderer,
};

describe('BulkCreateTable', () => {
  beforeEach(() => {
    mockCurrentUser();
    mockUseSwrAxios.mockRestore();
    mockAxiosRequest.mockRestore();
  });

  it(
    'submits two tags and two metrics',
    async () => {
      mockUseSwrAxios.mockImplementation(useSwrAxiosImpl);
      mockAxiosRequest.mockResolvedValue({});

      const { queryByTestId } = renderBulkCreateTable();

      queryByTestId(dataTestIds.add).click();

      expectValues('tags[0]');
      expectValues('tags[1]');

      // -> Change Tag1 and Metric1
      await changeValues('tags[0]', {
        pathIndex: 0,
        tagProviderIndex: 0,
        tagPathIndex: 0,
        measurementType: 'Electrical conductivity',
        measurementUnitIndex: 0,
        measurementName: tag1.measurementName,
        min: metric1.unitConfig.min,
        max: metric1.unitConfig.max,
      });
      // -> Change Tag2 and Metric2
      await changeValues('tags[1]', {
        pathIndex: 1,
        tagProviderIndex: 1,
        tagPathIndex: 1,
        measurementType: 'Temperature',
        measurementUnitIndex: 0,
        measurementName: tag2.measurementName,
        min: metric2.unitConfig.min,
        max: metric2.unitConfig.max,
      });

      expectValues('tags[0]', {
        path: getShortenedPath(tag1.path, true),
        tagProvider: tag1.tagProvider,
        tagPath: tag1.tagPath,
        measurementType: 'Electrical conductivity',
        measurementUnit: tag1.measurementUnit,
        measurementName: tag1.measurementName,
        min: metric1.unitConfig.min.toString(),
        max: metric1.unitConfig.max.toString(),
      });
      expectValues('tags[1]', {
        path: getShortenedPath(tag2.path, true),
        tagProvider: tag2.tagProvider,
        tagPath: tag2.tagPath,
        measurementType: 'Temperature',
        measurementUnit: tag2.measurementUnit,
        measurementName: tag2.measurementName,
        min: metric2.unitConfig.min.toString(),
        max: metric2.unitConfig.max.toString(),
      });

      await actAndAwait(() => queryByTestId(getSubmitButton()).click());

      expect(mockAxiosRequest).toHaveBeenCalledTimes(4);
      expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
        method: 'POST',
        url: expect.stringContaining('create-tag'),
        data: tag1,
      });
      expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, {
        method: 'POST',
        url: expect.stringContaining('create-tag'),
        data: tag2,
      });
      expect(mockAxiosRequest).toHaveBeenNthCalledWith(3, {
        method: 'POST',
        url: expect.stringContaining('create-metric'),
        data: metric1,
      });
      expect(mockAxiosRequest).toHaveBeenNthCalledWith(4, {
        method: 'POST',
        url: expect.stringContaining('create-metric'),
        data: metric2,
      });
      expect(queryByTestId(getSubmitButton())).toBeDisabled();
      expect(queryByTestId(dataTestIds.error('tags', 0))).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.error('tags', 1))).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.persisted('tags', 0))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.persisted('tags', 1))).toBeInTheDocument();
    },
    customTimeout
  );

  it(
    'submits two tags without metrics',
    async () => {
      mockUseSwrAxios.mockImplementation(useSwrAxiosImpl);
      mockAxiosRequest.mockResolvedValue({});

      const { queryByTestId } = renderBulkCreateTable();

      queryByTestId(dataTestIds.add).click();

      expectValues('tags[0]');
      expectValues('tags[1]');

      // -> Change Tag1 and Metric1
      await changeValues('tags[0]', {
        pathIndex: 0,
        tagProviderIndex: 0,
        tagPathIndex: 0,
        measurementType: 'Electrical conductivity',
        measurementUnitIndex: 0,
        measurementName: tag1.measurementName,
      });
      // -> Change Tag2 and Metric2
      await changeValues('tags[1]', {
        pathIndex: 1,
        tagProviderIndex: 1,
        tagPathIndex: 1,
        measurementType: 'Temperature',
        measurementUnitIndex: 0,
        measurementName: tag2.measurementName,
      });

      expectValues('tags[0]', {
        path: getShortenedPath(tag1.path, true),
        tagProvider: tag1.tagProvider,
        tagPath: tag1.tagPath,
        measurementType: 'Electrical conductivity',
        measurementUnit: tag1.measurementUnit,
        measurementName: tag1.measurementName,
      });
      expectValues('tags[1]', {
        path: getShortenedPath(tag2.path, true),
        tagProvider: tag2.tagProvider,
        tagPath: tag2.tagPath,
        measurementType: 'Temperature',
        measurementUnit: tag2.measurementUnit,
        measurementName: tag2.measurementName,
      });

      await actAndAwait(() => queryByTestId(getSubmitButton()).click());

      expect(mockAxiosRequest).toHaveBeenCalledTimes(2);
      expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
        method: 'POST',
        url: expect.stringContaining('create-tag'),
        data: tag1,
      });
      expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, {
        method: 'POST',
        url: expect.stringContaining('create-tag'),
        data: tag2,
      });
      expect(queryByTestId(getSubmitButton())).toBeDisabled();
      expect(queryByTestId(dataTestIds.error('tags', 0))).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.error('tags', 1))).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.persisted('tags', 0))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.persisted('tags', 1))).toBeInTheDocument();
    },
    customTimeout
  );

  it(
    'renders backend errors',
    async () => {
      const error = 'something wrong happened';
      mockUseSwrAxios.mockImplementation(useSwrAxiosImpl);
      mockAxiosRequest.mockRejectedValue({ data: { error } });

      const { queryByTestId } = renderBulkCreateTable();

      expectValues('tags[0]');

      // -> Change Tag1 and Metric1
      await changeValues('tags[0]', {
        pathIndex: 0,
        tagProviderIndex: 0,
        tagPathIndex: 0,
        measurementType: 'Electrical conductivity',
        measurementUnitIndex: 0,
        measurementName: tag1.measurementName,
      });

      await actAndAwait(() => queryByTestId(getSubmitButton()).click());

      expect(queryByTestId(getSubmitButton())).not.toBeDisabled();
      expect(queryByTestId(dataTestIds.error('tags', 0))).toBeInTheDocument();
    },
    customTimeout
  );

  it(
    'ignores errors if the tag and metric are already created',
    async () => {
      mockUseSwrAxios.mockImplementation(useSwrAxiosImpl);
      mockAxiosRequest.mockImplementation(async args => {
        if (args.url.includes('create-tag')) {
          return Promise.reject({ data: { error: FDS_TAG_ALREADY_EXISTS } });
        }
        if (args.url.includes('create-metric')) {
          return Promise.reject({ data: { error: EVS_METRIC_ALREADY_EXISTS } });
        }
      });
      const { queryByTestId } = renderBulkCreateTable();

      expectValues('tags[0]');

      // -> Change Tag1 and Metric1
      await changeValues('tags[0]', {
        pathIndex: 0,
        tagProviderIndex: 0,
        tagPathIndex: 0,
        measurementType: 'Electrical conductivity',
        measurementUnitIndex: 0,
        measurementName: tag1.measurementName,
        min: metric1.unitConfig.min,
        max: metric1.unitConfig.max,
      });

      await actAndAwait(() => queryByTestId(getSubmitButton()).click());

      expect(mockAxiosRequest).toHaveBeenCalledTimes(2);
      expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, {
        method: 'POST',
        url: expect.stringContaining('create-tag'),
        data: tag1,
      });
      expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, {
        method: 'POST',
        url: expect.stringContaining('create-metric'),
        data: metric1,
      });
      expect(queryByTestId(getSubmitButton())).toBeDisabled();
      expect(queryByTestId(dataTestIds.error('tags', 0))).not.toBeInTheDocument();
      expect(queryByTestId(dataTestIds.persisted('tags', 0))).toBeInTheDocument();
    },
    customTimeout
  );
});
