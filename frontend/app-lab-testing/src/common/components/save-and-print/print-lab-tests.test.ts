import { axiosRequest } from '@plentyag/core/src/utils/request';

import { printLabTests, StickerData } from './print-lab-tests';

jest.mock('@plentyag/core/src/utils/request');

const mockAxiosRequest = axiosRequest as jest.Mock;

mockAxiosRequest.mockResolvedValue({ data: { status: true } });

describe('printLabTests()', () => {
  afterEach(() => {
    mockAxiosRequest.mockReset();
  });

  function expectPostDataToMatch(stickerData: StickerData[]) {
    const postData = {
      stickerType: 'sample',
      stickers: stickerData,
    };
    expect(mockAxiosRequest).toHaveBeenCalledWith({ url: expect.anything(), method: 'post', data: postData });
  }

  const testData = {
    sampleId: '1',
    sampleDate: new Date('December 17, 2019'),
    sampleTime: new Date('December 17, 2019 12:30:00'),
    sampleType: 'some-type',
    labelDetails: '',
    location: {},
    lotCodes: [],
    trialIds: '',
    treatmentIds: '',
  };

  // common data expecte in most tests, some tests will override to tests specific aspects.
  const commonStickerData: StickerData = {
    id: '1',
    sampling_date: '12/17/2019',
    sampling_time: '12:30 PM',
    test_kind: 'some-type',
    packaging_lot: '',
    location_row1: '',
    location_row2: '',
    trial: '',
    treatment: '',
  };

  it('prints label containing: sample id, date, time, and type', async () => {
    await printLabTests([testData]);

    expectPostDataToMatch([commonStickerData]);
  });

  it('prints label without sample time', async () => {
    const data = [{ ...testData, sampleTime: new Date('invalid-date') }];

    await printLabTests(data);

    const stickers: StickerData[] = [
      {
        ...commonStickerData,
        sampling_time: '', // should be empty since sample time provided was not valid.
      },
    ];
    expectPostDataToMatch(stickers);
  });

  it('prints labelDetails if provided', async () => {
    const data = [
      { ...testData, labelDetails: 'some label details split over two lines', location: { path: 'sites/SSF2' } },
    ];

    await printLabTests(data);

    const stickers: StickerData[] = [
      {
        ...commonStickerData,
        location_row1: 'some label details split over ',
        location_row2: 'two lines',
      },
    ];
    expectPostDataToMatch(stickers);
  });

  it('prints location info when label details not provided', async () => {
    const data = [
      {
        ...testData,
        labelDetails: '',
        location: { path: 'sites/SSF2/areas/Propagation/lines/PropagationRack/tells/UnloadPropLine' },
      },
    ];

    await printLabTests(data);

    const stickers: StickerData[] = [
      {
        ...commonStickerData,
        location_row1: 'SSF2/Propagation/',
        location_row2: 'PropagationRack/UnloadPropLine',
      },
    ];
    expectPostDataToMatch(stickers);
  });

  it('prints trial and treatment ids', async () => {
    const data = [
      {
        ...testData,
        trialIds: '1,2,3',
        treatmentIds: '4,5,6',
      },
    ];

    await printLabTests(data);

    const stickers: StickerData[] = [
      {
        ...commonStickerData,
        trial: '1,2,3',
        treatment: '4,5,6',
      },
    ];
    expectPostDataToMatch(stickers);
  });

  it('truncates trial and treatment to max of 25 chars', async () => {
    const data = [
      {
        ...testData,
        trialIds: '012345678901234567890123456789',
        treatmentIds: '012345678901234567890123456789',
      },
    ];

    await printLabTests(data);

    const stickers: StickerData[] = [
      {
        ...commonStickerData,
        trial: '0123456789012345678901...',
        treatment: '0123456789012345678901...',
      },
    ];
    expectPostDataToMatch(stickers);
  });

  it('prints range if more than one lot code provided then ', async () => {
    const data = [
      {
        ...testData,
        lotCodes: ['3-TIGRIS-B20-279', '3-TIGRIS-B20-280', '3-TIGRIS-B20-281'],
      },
    ];

    await printLabTests(data);

    const stickers: StickerData[] = [
      {
        ...commonStickerData,
        packaging_lot: '279-281',
      },
    ];
    expectPostDataToMatch(stickers);
  });

  it('prints entire lot code if single lot code provided then ', async () => {
    const data = [
      {
        ...testData,
        lotCodes: ['3-TIGRIS-B20-279'],
      },
    ];

    await printLabTests(data);

    const stickers: StickerData[] = [
      {
        ...commonStickerData,
        packaging_lot: '3-TIGRIS-B20-279',
      },
    ];
    expectPostDataToMatch(stickers);
  });

  it('prints two labels', async () => {
    await printLabTests([testData, testData]);

    const result = {
      ...commonStickerData,
    };
    const stickers: StickerData[] = [result, result];
    expectPostDataToMatch(stickers);
  });
});
