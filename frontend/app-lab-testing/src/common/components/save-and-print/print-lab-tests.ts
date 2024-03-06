import { DateTimeFormat, generatePdf, getShortenedPath, isValidDate } from '@plentyag/core/src/utils';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { truncate } from 'lodash';
import { DateTime } from 'luxon';

export interface StickerData {
  id: string;
  sampling_date: string;
  sampling_time: string;
  test_kind: string;
  packaging_lot: string;
  location_row1: string;
  location_row2: string;
  trial: string;
  treatment: string;
}

interface PrintResult {
  base64Str: string;
}

function makeSticker(params: {
  sampleId: string;
  sampleDate: Date;
  sampleTime: Date;
  sampleType: string;
  locationRow1?: string;
  locationRow2?: string;
  lotCode?: string;
  trialIds?: string;
  treatmentIds?: string;
}): StickerData {
  return {
    id: params.sampleId,
    sampling_date: `${
      params.sampleDate.getMonth() + 1
    }/${params.sampleDate.getDate()}/${params.sampleDate.getFullYear()}`,
    sampling_time: isValidDate(params.sampleTime)
      ? DateTime.fromJSDate(params.sampleTime).toFormat(DateTimeFormat.US_TIME_ONLY)
      : '',
    test_kind: params.sampleType,
    packaging_lot: params.lotCode || '',
    location_row1: params.locationRow1 || '',
    location_row2: params.locationRow2 || '',
    trial: truncate(params.trialIds, { length: 25 }) || '',
    treatment: truncate(params.treatmentIds, { length: 25 }) || '',
  };
}

export async function printLabTests(dataToPrint: LT.PrintData[]): Promise<{ status: boolean; error?: string }> {
  const url = '/api/plentyservice/qr-service/create-qr-pdf';

  const stickers: StickerData[] = [];

  dataToPrint.forEach(result => {
    const sampleId = result.sampleId;
    const sampleDate = result.sampleDate;
    const sampleTime = result.sampleTime;
    const sampleType = result.sampleType;
    const trialIds = result.trialIds;
    const treatmentIds = result.treatmentIds;
    let locationRow1;
    let locationRow2;

    // if tower exists, only show tower.
    if (result.labelDetails) {
      // split tower into two parts since label is approx 34 chars wide.
      // - 1st line: first 30 chars
      // - 2nd line the rest of text.
      const splitPoint = 30;
      locationRow1 = result.labelDetails.substring(0, splitPoint);
      locationRow2 = result.labelDetails.substring(splitPoint);
    } else if (result.location.path) {
      // else show farm def location, use shorted path
      const shortedPath = getShortenedPath(result.location.path, true);
      const separatorChar = '/';
      // split location into two parts since label is approx 34 chars wide.
      // - 1st line: first two parts.
      // - 2nd line: rest of str
      const parts = shortedPath.split(separatorChar).filter(item => item);
      locationRow1 = parts.slice(0, 2).join(separatorChar);
      locationRow2 = parts.slice(2).join(separatorChar);
      if (locationRow2) {
        locationRow1 += separatorChar;
      }
    }

    if (result.lotCodes.length > 1) {
      // if multiple lot codes, pick lowest and highest from julian date.
      const lotCodes = result.lotCodes
        .map(lotCode => {
          const parts = lotCode.split('-');
          if (parts.length === 4) {
            return parts[3];
          }
          return '';
        })
        .filter(item => item);

      lotCodes.sort((a, b) => {
        return Number(a) - Number(b);
      });

      const lowest = lotCodes[0];
      const highest = lotCodes[lotCodes.length - 1];
      const lotCodeRange = `${lowest}-${highest}`;
      stickers.push(
        makeSticker({
          sampleId,
          sampleDate,
          sampleTime,
          sampleType,
          locationRow1,
          locationRow2,
          lotCode: lotCodeRange,
          trialIds,
          treatmentIds,
        })
      );
    } else {
      const lotCode = result.lotCodes.length === 1 ? result.lotCodes[0] : '';
      stickers.push(
        makeSticker({
          sampleId,
          sampleDate,
          sampleTime,
          sampleType,
          locationRow1,
          locationRow2,
          lotCode,
          trialIds,
          treatmentIds,
        })
      );
    }
  });

  const data = {
    stickerType: 'sample',
    stickers,
  };

  try {
    const result = await axiosRequest<PrintResult>({ url, method: 'post', data });
    if (result.data && result.data.base64Str) {
      const blobUrl = generatePdf(result.data.base64Str);
      window.open(blobUrl, '_blank');

      return {
        status: true,
      };
    } else {
      return {
        status: false,
        error: `${result.status}:${result.statusText} ${result.data}`,
      };
    }
  } catch (err) {
    let errMsg = err.message;
    if (err.response) {
      const data = (err.response.data && err.response.data.toString()) || err.response.statusText || '';
      errMsg = `${err.response.status}: ${data}`;
    }
    return {
      status: false,
      error: errMsg,
    };
  }
}
