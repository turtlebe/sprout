import { IngestFileType } from '@plentyag/app-devices/src/common/types/ingest-file-type';
import * as yup from 'yup';

import '@plentyag/core/src/yup/extension';

export interface UseCsvIngestFormGenConfigReturn extends FormGen.Config {}

export const useCsvIngestFormGenConfig = (): UseCsvIngestFormGenConfigReturn => {
  return {
    title: 'CSV/JSON Ingest',
    createEndpoint: '/api/plentyservice/device-management/ingest-csv-file/:ingestFileType',
    headers: { 'Content-Type': 'multipart/form-data' },
    serialize: values => {
      const form = new FormData();
      form.append('file', values.file[0].file);

      return form;
    },
    fields: [
      {
        type: 'Select',
        label: 'Ingest File Type',
        name: 'ingestFileType',
        options: [
          { label: 'Birth Certificate', value: IngestFileType.birthCertificate },
          { label: 'Factory Testing', value: IngestFileType.factoryTesting },
          { label: 'Sprinkles 2 CSV Calibration', value: IngestFileType.sprinkles2Calibration },
          { label: 'Sprinkles 2 JSON Calibration', value: IngestFileType.sprinkles2JsonCalibration },
        ],
        validate: yup.string().required(),
      },
      {
        type: 'DragAndDrop',
        name: 'file',
        label: 'CSV File',
        dropzoneUploaderProps: { maxFiles: 1, accept: '*', minSizeBytes: 1 },
        validate: yup.mixed().required().validateDragAndDrop(),
      },
    ],
  };
};
