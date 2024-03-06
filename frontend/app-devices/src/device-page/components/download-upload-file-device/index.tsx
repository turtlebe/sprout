import { Device } from '@plentyag/app-devices/src/common/types';
import { DeviceDataType } from '@plentyag/app-devices/src/common/types/device-data-type';
import { UploadFile } from '@plentyag/brand-ui/src/components';
import { Box, Button, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { usePostRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { toQueryParams } from '@plentyag/core/src/utils/to-query-params';
import React from 'react';

import { DownloadFile } from '../download-file';

const dataTestIds = {
  loader: 'download-upload-file-device-loader',
  download: 'download-upload-file-device-download',
  reUpload: 'download-upload-file-device-upload',
};

export { dataTestIds as dataTestIdsDownloadUploadFileDevice };

interface DeviceFileResponse {
  url: string;
}

interface UploadDeviceFileRequest {
  deviceId: string;
  dataType: DeviceDataType;
}

export interface DownloadUploadFileDevice {
  device: Device;
  dataType: DeviceDataType;
  disableUpload?: boolean;
}

export const DownloadUploadFileDevice: React.FC<DownloadUploadFileDevice> = ({ device, dataType, disableUpload }) => {
  const [showUpload, setShowUpload] = React.useState<boolean>(false);
  const requests = {
    getS3UploadUrl: usePostRequest<DeviceFileResponse, UploadDeviceFileRequest>({
      url: '/api/plentyservice/device-management/get-s3-url-for-device-data-upload',
    }),
    getS3DownloadUrl: useSwrAxios<DeviceFileResponse>({
      url: `/api/plentyservice/device-management/get-s3-url-for-device-data-download${toQueryParams({
        device_id: device.id,
        data_type: dataType,
      })}`,
    }),
  };
  const handleSubmit: UploadFile['onSubmit'] = file => {
    requests.getS3UploadUrl.makeRequest({
      data: {
        deviceId: device.id,
        dataType,
      },
      onSuccess: async response => {
        await axiosRequest({
          method: 'PUT',
          url: response.url,
          data: file,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        void requests.getS3DownloadUrl.revalidate().then(() => setShowUpload(false));
      },
      onError: response => console.error(response),
    });
  };

  if (requests.getS3DownloadUrl.isValidating) {
    return <CircularProgress size="12px" data-testid={dataTestIds.loader} />;
  }

  if (disableUpload) {
    return <DownloadFile href={requests.getS3DownloadUrl.data?.url} data-testid={dataTestIds.download} />;
  }

  return showUpload || !requests.getS3DownloadUrl.data?.url ? (
    <UploadFile
      onSubmit={handleSubmit}
      isUploading={requests.getS3UploadUrl.isLoading || requests.getS3DownloadUrl.isValidating}
      onClose={() => setShowUpload(false)}
    />
  ) : (
    <Box display="flex" alignItems="center">
      <DownloadFile href={requests.getS3DownloadUrl.data?.url} data-testid={dataTestIds.download} />
      {requests.getS3DownloadUrl.data?.url && (
        <>
          <Box padding={0.5} />
          or
          <Box padding={0.5} />
          <Button variant="outlined" onClick={() => setShowUpload(true)} data-testid={dataTestIds.reUpload}>
            re-upload
          </Button>
        </>
      )}
    </Box>
  );
};
