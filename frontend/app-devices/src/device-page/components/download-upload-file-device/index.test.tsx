import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { DeviceDataType } from '@plentyag/app-devices/src/common/types/device-data-type';
import { usePostRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDownloadUploadFileDevice as dataTestIds, DownloadUploadFileDevice } from '.';

jest.mock('@plentyag/core/src/utils/request');
jest.mock('@plentyag/core/src/hooks');
jest.mock('@plentyag/brand-ui/src/components/upload-file', () => ({
  UploadFile: ({ onSubmit }) => <button data-testid="upload-file" onClick={() => onSubmit({})} />,
}));

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockAxiosRequest = axiosRequest as jest.Mock;
const device = mockDevices[0];

describe('DownloadUploadFileDevice', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    mockAxiosRequest.mockRestore();
  });

  it('renders a loading state', () => {
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { queryByTestId } = render(<DownloadUploadFileDevice device={device} dataType={DeviceDataType.config} />);

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
  });

  it('renders and does not allow uploading', () => {
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });

    const { queryByTestId } = render(
      <DownloadUploadFileDevice device={device} dataType={DeviceDataType.config} disableUpload={true} />
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.download)).toBeInTheDocument();
    expect(queryByTestId('upload-file')).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.reUpload)).not.toBeInTheDocument();
  });

  it('renders a re-uploading CTA', () => {
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ data: { url: '/mock-url' }, isValidating: false });

    const { queryByTestId } = render(<DownloadUploadFileDevice device={device} dataType={DeviceDataType.config} />);

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.download)).toBeInTheDocument();
    expect(queryByTestId('upload-file')).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.reUpload)).toBeInTheDocument();
  });

  it('renders the uploading widget when allowed and no file is present', () => {
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });

    const { queryByTestId } = render(<DownloadUploadFileDevice device={device} dataType={DeviceDataType.config} />);

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.download)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.reUpload)).not.toBeInTheDocument();
    expect(queryByTestId('upload-file')).toBeInTheDocument();
  });

  it('fetches and uploads a device file', async () => {
    const makeRequest = jest.fn().mockImplementation(args => {
      expect(args.data).toEqual({ deviceId: device.id, dataType: 'CONFIG' });
      expect(args.onSuccess).toBeDefined();
      args.onSuccess({ url: 'foobar' });
    });
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest });
    mockUseSwrAxios.mockImplementation(args => {
      expect(args.url).toBe(
        `/api/plentyservice/device-management/get-s3-url-for-device-data-download?device_id=${device.id}&data_type=CONFIG`
      );
      return { data: { url: '/mock-url' }, isValidating: false, revalidate: jest.fn().mockResolvedValue({}) };
    });

    const { queryByTestId } = render(<DownloadUploadFileDevice device={device} dataType={DeviceDataType.config} />);

    expect(queryByTestId(dataTestIds.download)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.reUpload)).toBeInTheDocument();
    expect(queryByTestId('upload-file')).not.toBeInTheDocument();

    queryByTestId(dataTestIds.reUpload).click();

    expect(queryByTestId(dataTestIds.download)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.reUpload)).not.toBeInTheDocument();
    expect(queryByTestId('upload-file')).toBeInTheDocument();

    await actAndAwait(() => queryByTestId('upload-file').click());

    expect(makeRequest).toHaveBeenCalled();
    expect(mockAxiosRequest).toHaveBeenCalled();
    expect.assertions(13); // mockUseSwrAxios runs 2x
  });
});
